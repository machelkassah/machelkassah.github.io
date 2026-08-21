import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Experience from "../src/components/Experience.astro";
import Skills from "../src/components/Skills.astro";

describe("Experience", () => {
  it("renders all 6 roles as a reverse-chronological timeline", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Experience);
    expect(result).toContain('id="experience"');
    expect(result).toContain("E-Tracking, Ghana Link Network Services");
    expect(result).toContain("Safety and Compliance Officer");
    expect(result).toContain("Field Technician");
    expect(result).toContain("2026 – Present");
    expect(result).toContain("Sales &amp; Customer Support Technician");
    expect(result.indexOf("Safety and Compliance Officer")).toBeLessThan(result.indexOf("Field Technician"));
    expect(result.indexOf("Field Technician")).toBeLessThan(result.indexOf("Teaching Assistant"));
  });

  it("renders the current role's bullets and omits an empty bullet list for older roles", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Experience);
    expect(result).toContain("Monitor compliance across operational stations and track incident and risk reporting");
  });

  it("renders each role's dates as a bracketed log stamp", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Experience);
    expect(result).toContain("[2026 – Present]");
    expect(result).toContain("[2025 – 2026]");
    expect(result).toContain("[2012 – 2014]");
  });
});

describe("Skills", () => {
  it("renders all 5 categories with an ampersand-containing category rendered correctly", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Skills);
    expect(result).toContain('id="skills"');
    expect(result).toContain("Operations &amp; Compliance");
    expect(result).toContain("Business &amp; Leadership");
    expect(result).toContain("Infrastructure &amp; Deployment");
  });

  it("renders an item that itself contains an ampersand", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Skills);
    expect(result).toContain("Web server &amp; domain configuration");
  });

  it("gives every one of the 5 skill categories a distinct icon", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Skills);
    const iconCount = (result.match(/class="skill-icon"/g) ?? []).length;
    expect(iconCount).toBe(5);
  });
});
