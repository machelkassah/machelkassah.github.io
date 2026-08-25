import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import HomePage from "../src/pages/index.astro";

describe("Home page", () => {
  it("assembles every section in the spec's order with the right ids", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(HomePage);
    const ids = ["home", "about", "experience", "skills", "projects", "ventures", "education", "contact"];
    let lastIndex = -1;
    for (const id of ids) {
      const idx = result.indexOf(`id="${id}"`);
      expect(idx, `expected id="${id}" to be present`).toBeGreaterThan(-1);
      expect(idx, `expected id="${id}" to come after the previous section`).toBeGreaterThan(lastIndex);
      lastIndex = idx;
    }
  });

  it("sets the composed home title and positioning-statement description", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(HomePage);
    expect(result).toContain("<title>Machel Kassah — Operations Technologist &amp; Digital Systems Builder</title>");
    expect(result).toContain('content="I design practical digital systems');
  });

  it("has exactly one h1", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(HomePage);
    const h1Count = (result.match(/<h1[ >]/g) ?? []).length;
    expect(h1Count).toBe(1);
  });

  it("never mentions a phone number or a CV/résumé download anywhere on the page", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(HomePage);
    expect(result.toLowerCase()).not.toMatch(/resume|curriculum vitae|\.pdf|tel:|\+233/);
  });
});
