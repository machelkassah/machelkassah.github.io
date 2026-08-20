import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import VenturesPreview from "../src/components/VenturesPreview.astro";
import VenturesFull from "../src/components/VenturesFull.astro";
import VenturesPage from "../src/pages/ventures.astro";

describe("VenturesPreview (Home)", () => {
  it("shows all 3 ventures with a link to /ventures", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(VenturesPreview);
    expect(result).toContain('id="ventures"');
    expect(result).toContain("Enthrive");
    expect(result).toContain("DeleOps");
    expect(result).toContain("Opsella");
    expect(result).toContain('href="/ventures"');
  });
});

describe("VenturesFull", () => {
  it("renders all 3 ventures with their copy-file descriptions", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(VenturesFull);
    expect(result).toContain("Corporate branding, merchandise, and creative/media services based in Ghana.");
    expect(result).toContain(
      "Software engineering and technology products, including internal business systems and Opsella."
    );
    expect(result).toContain("A POS and ERP platform for small and growing businesses.");
  });
});

describe("/ventures page", () => {
  it("sets a dedicated title, description, and active nav state", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(VenturesPage);
    expect(result).toContain("<title>Ventures — Machel Kassah</title>");
    expect(result).toContain('aria-current="page"');
  });
});
