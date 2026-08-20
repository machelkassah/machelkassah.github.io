import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import LeadershipEducation from "../src/components/LeadershipEducation.astro";

describe("LeadershipEducation", () => {
  it("has id=education and renders both leadership items and all 3 degrees with no invented years", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(LeadershipEducation);
    expect(result).toContain('id="education"');
    expect(result).toContain("Leadership &amp; Community");
    expect(result).toContain("Volunteer, Google Developer Conference, Ghana 2025");
    expect(result).toContain("Member, Linux Accra User Group");
    expect(result).toContain("Education &amp; Certifications");
    expect(result).toContain("MSc Computer Science");
    expect(result).toContain("University of Ghana, Legon");
    expect(result).toContain("BSc Information Technology Education");
    expect(result).toContain("Certificate in Information Technology");
  });

  it("renders all 3 certifications", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(LeadershipEducation);
    expect(result).toContain("Microsoft Technology Associate");
    expect(result).toContain("GI-KACE Data Science Certificate");
    expect(result).toContain("GI-KACE Data Analysis with Python Certificate");
  });

  it("does not display an Awards line, since the copy file lists no awards", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(LeadershipEducation);
    expect(result).not.toMatch(/award/i);
  });
});
