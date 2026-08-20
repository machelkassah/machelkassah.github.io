import { describe, it, expect } from "vitest";
import { mkdirSync, writeFileSync, unlinkSync } from "node:fs";
import { resolve, join } from "node:path";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import ImagePlaceholder from "../src/components/ImagePlaceholder.astro";

describe("ImagePlaceholder", () => {
  it("renders a dashed placeholder box with the guidance text when no real image exists", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ImagePlaceholder, {
      props: {
        src: "/images/does-not-exist.jpg",
        alt: "Test alt text",
        guidance: "Test guidance copy",
        aspect: "16/9",
      },
    });
    expect(result).toContain("Test guidance copy");
    expect(result).toContain('aria-label="Test alt text"');
    expect(result).toContain("aspect-ratio: 16/9");
  });

  it("renders a real <img> when a file exists at the swap path", async () => {
    const dir = resolve(process.cwd(), "public/images");
    mkdirSync(dir, { recursive: true });
    const filePath = join(dir, "test-swap.jpg");
    writeFileSync(filePath, "");
    try {
      const container = await AstroContainer.create();
      const result = await container.renderToString(ImagePlaceholder, {
        props: {
          src: "/images/test-swap.jpg",
          alt: "Swapped alt",
          guidance: "unused",
          aspect: "4/5",
        },
      });
      expect(result).toContain('src="/images/test-swap.jpg"');
      expect(result).toContain('alt="Swapped alt"');
    } finally {
      unlinkSync(filePath);
    }
  });
});
