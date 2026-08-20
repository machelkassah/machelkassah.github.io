import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/styles/global.css", import.meta.url), "utf-8");

describe("design tokens", () => {
  it("defines the spec color palette", () => {
    expect(css).toContain("--color-bg: #F6F1E7");
    expect(css).toContain("--color-bg-alt: #EFE7D8");
    expect(css).toContain("--color-ink: #211D19");
    expect(css).toContain("--color-ink-muted: #5A5248");
    expect(css).toContain("--color-accent: #C1531E");
    expect(css).toContain("--color-accent-tint: #F0DCCB");
  });

  it("defines the spec font stack variables", () => {
    expect(css).toContain('--font-display: "Fraunces"');
    expect(css).toContain('--font-body: "Archivo"');
    expect(css).toContain('--font-mono: "IBM Plex Mono"');
  });

  it("respects prefers-reduced-motion", () => {
    expect(css).toContain("prefers-reduced-motion: reduce");
  });

  it("defines the reveal animation utility classes", () => {
    expect(css).toContain(".reveal-1");
    expect(css).toContain(".reveal-4");
    expect(css).toContain("@keyframes reveal-up");
  });
});
