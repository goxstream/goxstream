import fs from "fs/promises";
// fontkit 2 currently ships no declarations for its ESM entrypoint.
// @ts-expect-error The adapter below provides the small API surface we use.
import fontkitModule from "fontkit";

interface FontkitFont {
  unitsPerEm: number;
  ascent: number;
  descent: number;
  layout(text: string): {
    glyphs: Array<{ path: { toSVG(): string } }>;
    positions: Array<{ xAdvance: number }>;
  };
}

const fontkit = fontkitModule as unknown as {
  create(buffer: Buffer): FontkitFont;
};

const WORDMARK_PATTERN = /<text([^>]*)>(?:\s*<tspan([^>]*)>Gox<\/tspan>\s*<tspan([^>]*)>Stream<\/tspan>\s*)<\/text>/;

function getAttribute(attributes: string, name: string): string | undefined {
  return attributes.match(new RegExp(`${name}="([^"]+)"`))?.[1];
}

export async function convertWordmarkTextToPaths(
  svg: string,
  fontPath: string
): Promise<string> {
  const font = fontkit.create(await fs.readFile(fontPath));
  const match = svg.match(WORDMARK_PATTERN);

  if (!match) {
    throw new Error("Could not find the React-rendered wordmark text node.");
  }

  const [, textAttributes, goxAttributes, streamAttributes] = match;
  const x = Number(getAttribute(textAttributes, "x"));
  const y = Number(getAttribute(textAttributes, "y"));
  const fontSize = Number(getAttribute(textAttributes, "font-size"));
  const letterSpacing = Number(getAttribute(textAttributes, "letter-spacing") ?? 0);
  const scale = fontSize / font.unitsPerEm;
  const baseline = y + ((font.ascent + font.descent) / 2) * scale;
  const run = font.layout("GoxStream");
  const goxCount = 3;
  let cursor = x;

  const paths = run.glyphs.map((glyph, index) => {
    const path = `<path d="${glyph.path.toSVG()}" transform="translate(${cursor} ${baseline}) scale(${scale} ${-scale})" fill="${index < goxCount ? getAttribute(goxAttributes, "fill") : getAttribute(streamAttributes, "fill")}"/>`;
    cursor += run.positions[index].xAdvance * scale + letterSpacing;
    return path;
  });

  return svg.replace(match[0], paths.join(""));
}