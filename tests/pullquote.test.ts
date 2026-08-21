import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import PullQuote from "../src/components/PullQuote.astro";

describe("PullQuote", () => {
  it("renders the positioning statement verbatim as a full-bleed dark quote treatment", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(PullQuote);
    expect(result).toContain(
      "I design practical digital systems, strengthen operational processes, and turn real business problems into working technology"
    );
    expect(result).toContain("pullquote");
  });
});
