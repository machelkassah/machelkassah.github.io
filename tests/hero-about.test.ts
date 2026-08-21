import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Hero from "../src/components/Hero.astro";
import About from "../src/components/About.astro";

const heroSource = readFileSync(new URL("../src/components/Hero.astro", import.meta.url), "utf-8");

describe("Hero", () => {
  it("renders name, headline, positioning statement, and both CTAs", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Hero);
    expect(result).toContain('id="home"');
    expect(result).toContain("Machel Kassah");
    expect(result).toContain("Operations Technologist");
    expect(result).toContain("Digital Systems Builder");
    expect(result).toContain(">View My Work<");
    expect(result).toContain(">Get in Touch<");
    expect(result).toContain('href="/projects"');
    expect(result).toContain('href="#contact"');
  });

  it("renders the real hero photo, not a placeholder", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Hero);
    expect(result).toContain('src="/images/hero-portrait.png"');
    expect(result).toContain("aspect-ratio: 864/1184");
  });

  it("shows floating status badges grounded in real project data next to the photo", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Hero);
    expect(result).toContain("hero__badge");
    expect(result).toContain("Opsella · 87% complete");
    expect(result).toContain("Daily Activity Log · Live");
    expect(result).toContain("status-dot--progress");
  });

  it("masks the portrait into a feathered oval instead of a hard-cornered card", () => {
    expect(heroSource).toContain("mask-image");
    expect(heroSource).not.toContain("border-radius: 1.5rem");
  });

  it("shows a live status readout and a facts rule with the real current role and location", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Hero);
    expect(result).toContain("status-dot--live");
    expect(result).toContain("Safety and Compliance Officer");
    expect(result).toContain("Accra, Ghana");
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

  it("renders the real secondary photo, not a placeholder", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(About);
    expect(result).toContain('src="/images/about-secondary.jpg"');
    expect(result).toContain("aspect-ratio: 736/1080");
  });
});
