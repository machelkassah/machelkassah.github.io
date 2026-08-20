import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Hero from "../src/components/Hero.astro";
import About from "../src/components/About.astro";

describe("Hero", () => {
  it("renders name, headline, positioning statement, and both CTAs", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Hero);
    expect(result).toContain('id="home"');
    expect(result).toContain("Machel Kassah");
    expect(result).toContain("Operations Technologist");
    expect(result).toContain("Digital Systems Builder");
    expect(result).toContain("I design practical digital systems");
    expect(result).toContain(">View My Work<");
    expect(result).toContain(">Get in Touch<");
    expect(result).toContain('href="/projects"');
    expect(result).toContain('href="#contact"');
  });

  it("includes the hero portrait placeholder", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Hero);
    expect(result).toContain("Professional headshot, front-facing");
    expect(result).toContain("aspect-ratio: 4/5");
  });
});

describe("About", () => {
  it("has id=about and renders all 4 paragraphs with Enthrive/DeleOps/Opsella emphasized", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(About);
    expect(result).toContain('id="about"');
    expect(result).toContain("intersection of operations, compliance, and technology");
    expect(result).toContain("<strong>Enthrive</strong>");
    expect(result).toContain("<strong>DeleOps</strong>");
    expect(result).toContain("<strong>Opsella</strong>");
    expect(result).toContain("drawn to problems that sit between people, process, and technology");
  });

  it("includes the secondary photo placeholder", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(About);
    expect(result).toContain("candid, working-context shot");
  });
});
