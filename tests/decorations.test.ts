import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Blob from "../src/components/Blob.astro";
import InkSplash from "../src/components/InkSplash.astro";
import SkillIcon from "../src/components/SkillIcon.astro";

describe("Blob", () => {
  it("renders a hidden decorative circle in the requested tint color and position", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Blob, {
      props: { color: "teal", size: "20rem", top: "-4rem", right: "-6rem" },
    });
    expect(result).toContain('aria-hidden="true"');
    expect(result).toContain("background-color: var(--color-teal-tint)");
    expect(result).toContain("width:20rem");
    expect(result).toContain("top:-4rem");
    expect(result).toContain("right:-6rem");
  });

  it("defaults to the accent tint when no color is given", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Blob, { props: {} });
    expect(result).toContain("background-color: var(--color-accent-tint)");
  });
});

describe("InkSplash", () => {
  it("renders a hidden decorative splatter SVG in the requested accent color", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(InkSplash, {
      props: { color: "teal", size: "6rem" },
    });
    expect(result).toContain('aria-hidden="true"');
    expect(result).toContain("color: var(--color-teal)");
    expect(result).toContain("<svg");
  });
});

describe("SkillIcon", () => {
  it("renders a distinct line icon per type, including the full 5-category set", async () => {
    const container = await AstroContainer.create();
    const types = ["paintbrush", "laptop", "wrench", "server", "briefcase"] as const;
    const rendered = await Promise.all(
      types.map((type) => container.renderToString(SkillIcon, { props: { type } }))
    );
    for (const svg of rendered) {
      expect(svg).toContain("<svg");
    }
    expect(new Set(rendered).size).toBe(types.length);
  });
});
