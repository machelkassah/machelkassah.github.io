import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const componentsDir = join(process.cwd(), "src/components");
const gridComponents = [
  "Hero.astro",
  "About.astro",
  "ProjectsPreview.astro",
  "ProjectsFull.astro",
  "VenturesPreview.astro",
  "LeadershipEducation.astro",
  "Contact.astro",
];

describe("responsive coverage", () => {
  it("every multi-column component defines a mobile breakpoint", () => {
    for (const file of gridComponents) {
      const content = readFileSync(join(componentsDir, file), "utf-8");
      expect(content, `${file} should define a @media breakpoint`).toMatch(/@media \(max-width: \d+px\)/);
    }
  });

  it("Header defines the mobile nav collapse breakpoint", () => {
    const content = readFileSync(join(componentsDir, "Header.astro"), "utf-8");
    expect(content).toMatch(/@media \(max-width: 640px\)/);
  });
});
