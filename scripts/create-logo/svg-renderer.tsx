import { renderToStaticMarkup } from "react-dom/server";
import { LogoBrand } from "../../src/components/logo-brand";

export function renderBrandSvg(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>${renderToStaticMarkup(
    <LogoBrand variant="horizontal" size="md" renderAs="svg" />
  )}`;
}