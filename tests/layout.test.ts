import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Header from "../src/components/Header.astro";
import Footer from "../src/components/Footer.astro";
import BaseLayout from "../src/layouts/BaseLayout.astro";

describe("Header", () => {
  it("links About/Experience/Skills/Contact to Home anchors and Projects/Ventures to their own pages", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Header, { props: {} });
    expect(result).toContain('href="/#about"');
    expect(result).toContain('href="/#experience"');
    expect(result).toContain('href="/#skills"');
    expect(result).toContain('href="/#contact"');
    expect(result).toContain('href="/projects"');
    expect(result).toContain('href="/ventures"');
  });

  it("marks the current page active via aria-current", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Header, { props: { currentPath: "/projects" } });
    expect(result).toContain('aria-current="page"');
  });
});

describe("Footer", () => {
  it("shows the personal email, LinkedIn, GitHub, and location, and no phone number", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Footer);
    expect(result).toContain("machelkassah@gmail.com");
    expect(result).toContain("linkedin.com/in/machelkassah");
    expect(result).toContain("github.com/machelkassah");
    expect(result).toContain("Accra, Ghana");
    expect(result.toLowerCase()).not.toMatch(/\+233|tel:/);
  });
});

describe("BaseLayout", () => {
  it("renders the page title, meta description, and OG tags from props", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(BaseLayout, {
      props: { title: "Test Title", description: "Test description" },
      slots: { default: "<p>Body content</p>" },
    });
    expect(result).toContain("<title>Test Title</title>");
    expect(result).toContain('content="Test description"');
    expect(result).toContain('property="og:title"');
    expect(result).toContain("Body content");
  });

  it("never renders a CV/résumé download link", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(BaseLayout, {
      props: { title: "t", description: "d" },
      slots: { default: "<p>x</p>" },
    });
    expect(result.toLowerCase()).not.toMatch(/resume|cv\.pdf|download.{0,10}cv/);
  });
});
