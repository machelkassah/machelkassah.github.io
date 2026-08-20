import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import IndexPage from "../src/pages/index.astro";

describe("project scaffold", () => {
  it("renders the placeholder home page", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(IndexPage);
    expect(result).toContain("Coming soon");
  });
});
