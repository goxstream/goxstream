import { renderToStaticMarkup } from "react-dom/server";
import { LogoBrand } from "../../src/components/logo-brand";
import { convertWordmarkTextToPaths } from "./font-path-converter";

export async function renderBrandSvg(fontPath: string): Promise<string> {
  const reactSvg = `<?xml version="1.0" encoding="UTF-8"?>${renderToStaticMarkup(
    <LogoBrand variant="horizontal" size="md" renderAs="svg" />
  )}`;

  return convertWordmarkTextToPaths(reactSvg, fontPath);
}