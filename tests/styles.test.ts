import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/styles/global.css", import.meta.url), "utf-8");

describe("design tokens", () => {
  it("defines the deep teal dominant color palette with warm ivory text", () => {
    expect(css).toContain("--color-bg: #0C2A2C");
    expect(css).toContain("--color-bg-alt: #123539");
    expect(css).toContain("--color-surface: #17403F");
    expect(css).toContain("--color-ink: #F5F0E4");
    expect(css).toContain("--color-ink-muted: #9DC2BE");
  });

  it("defines the warm amber accent for CTAs and highlights", () => {
    expect(css).toContain("--color-accent: #E2884A");
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

  it("defines the operational signal color (bright mint, legible on dark) and status-dot readout utilities", () => {
    expect(css).toContain("--color-signal: #5FCE9A");
    expect(css).toContain(".status-dot--live");
    expect(css).toContain(".status-dot--progress");
    expect(css).toContain(".readout");
  });

  it("defines a bright decorative teal (distinct from the dark teal background) and the blob utility", () => {
    expect(css).toContain("--color-teal: #6FD8C9");
    expect(css).toContain(".blob");
  });
});
