import { describe, it, expect } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import Contact from "../src/components/Contact.astro";

describe("Contact", () => {
  it("has id=contact and labels the personal and business emails separately", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Contact);
    expect(result).toContain('id="contact"');
    expect(result).toContain("Personal");
    expect(result).toContain("machelkassah@gmail.com");
    expect(result).toContain("Business inquiries");
    expect(result).toContain("deleoperations@gmail.com");
    expect(result).toContain("linkedin.com/in/machelkassah");
    expect(result).toContain("github.com/machelkassah");
    expect(result).toContain("Accra, Ghana");
  });

  it("has Name/Email/Message fields posting to the Formspree placeholder endpoint", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Contact);
    expect(result).toContain('name="name"');
    expect(result).toContain('name="email"');
    expect(result).toContain('name="message"');
    expect(result).toContain('action="https://formspree.io/f/YOUR_FORM_ID"');
  });

  it("has no phone input field", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Contact);
    expect(result).not.toContain('name="phone"');
  });

  it("includes the response-time note from the copy file", async () => {
    const container = await AstroContainer.create();
    const result = await container.renderToString(Contact);
    expect(result).toContain("I typically respond within 1–2 business days");
  });
});
