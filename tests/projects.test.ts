import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import ProjectsPreview from "../src/components/ProjectsPreview.astro";
import ProjectsFull from "../src/components/ProjectsFull.astro";
import ProjectsPage from "../src/pages/projects.astro";

describe("ProjectsPreview (Home)", () => {
  it("shows exactly Opsella and Daily Activity Log, Opsella first, with a link to /projects", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ProjectsPreview);
    expect(result).toContain('id="projects"');
    const opsellaIndex = result.indexOf("Opsella");
    const dailyIndex = result.indexOf("Daily Activity Log");
    expect(opsellaIndex).toBeGreaterThan(-1);
    expect(dailyIndex).toBeGreaterThan(-1);
    expect(opsellaIndex).toBeLessThan(dailyIndex);
    expect(result).not.toContain("Incident Reporter");
    expect(result).not.toContain("GearHub");
    expect(result).not.toContain("DreamHome");
    expect(result).toContain('href="/projects"');
  });
});

describe("ProjectsFull", () => {
  it("renders all 5 projects with Opsella first", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ProjectsFull);
    for (const name of [
      "Opsella",
      "Daily Activity Log",
      "Incident Reporter",
      "GearHub",
      "DreamHome CMS and E-commerce Platform",
    ]) {
      expect(result).toContain(name);
    }
    expect(result.indexOf("Opsella")).toBeLessThan(result.indexOf("Daily Activity Log"));
  });

  it("includes stack and role only where the copy file provides them", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ProjectsFull);
    expect(result).toContain("AdonisJS · MySQL · Docker · Tailwind CSS · AWS Lightsail");
    expect(result).toContain("Product design, database architecture, development, deployment");
    expect(result).toContain("My role:</strong> Developer");
  });
});

describe("/projects page", () => {
  it("sets a dedicated title, description, and active nav state", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(ProjectsPage);
    expect(result).toContain("<title>Projects — Machel Kassah</title>");
    expect(result).toContain('aria-current="page"');
  });
});
