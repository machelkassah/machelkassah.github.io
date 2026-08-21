import { describe, it, expect } from "vitest";
import { site } from "../src/data/site";
import { heroImage, aboutSecondaryImage } from "../src/data/images";
import { experience } from "../src/data/experience";
import { skills } from "../src/data/skills";
import { projects, projectStatusState } from "../src/data/projects";
import { ventures } from "../src/data/ventures";
import { leadership } from "../src/data/leadership";
import { education, certifications } from "../src/data/education";
import { contact } from "../src/data/contact";

describe("site data", () => {
  it("matches the copy file's name, headline, and positioning statement", () => {
    expect(site.name).toBe("Machel Kassah");
    expect(site.headline).toBe("Operations Technologist & Digital Systems Builder");
    expect(site.positioningStatement).toBe(
      "I design practical digital systems, strengthen operational processes, and turn real business problems into working technology — spanning compliance, software development, and data."
    );
  });

  it("has the two hero CTAs from the copy file", () => {
    expect(site.heroCtaPrimary).toEqual({ label: "View My Work", href: "/projects" });
    expect(site.heroCtaSecondary).toEqual({ label: "Get in Touch", href: "#contact" });
  });

  it("has exactly the 4 About paragraphs from the copy file, in order, with Enthrive/DeleOps/Opsella emphasized", () => {
    expect(site.about.paragraphs).toHaveLength(4);
    expect(site.about.paragraphs[0]).toContain("intersection of operations, compliance, and technology");
    expect(site.about.paragraphs[2]).toContain("<strong>Enthrive</strong>");
    expect(site.about.paragraphs[2]).toContain("<strong>DeleOps</strong>");
    expect(site.about.paragraphs[2]).toContain("<strong>Opsella</strong>");
    expect(site.about.paragraphs[3]).toContain("drawn to problems that sit between people, process, and technology");
  });
});

describe("site images", () => {
  it("defines the hero portrait placeholder at 4:5 with the copy file's guidance", () => {
    expect(heroImage.aspect).toBe("4/5");
    expect(heroImage.src).toBe("/images/hero-portrait.jpg");
    expect(heroImage.guidance).toContain("Professional headshot, front-facing");
  });

  it("defines the secondary About photo placeholder", () => {
    expect(aboutSecondaryImage.aspect).toBe("4/5");
    expect(aboutSecondaryImage.src).toBe("/images/about-secondary.jpg");
    expect(aboutSecondaryImage.guidance).toContain("candid, working-context shot");
  });
});

describe("experience data", () => {
  it("has all 5 roles in reverse chronological order", () => {
    expect(experience).toHaveLength(5);
    expect(experience.map((e) => e.company)).toEqual([
      "Ghana Link Network Services",
      "Hekimax Solutions Ltd",
      "Hekimax Solutions Ltd",
      "Hekimax Solutions Ltd",
      "University of Education, Winneba",
    ]);
    expect(experience.map((e) => e.role)).toEqual([
      "Safety and Compliance Officer",
      "Operations Lead",
      "Technical Support Manager",
      "Sales & Customer Support Technician",
      "Teaching Assistant",
    ]);
    expect(experience.map((e) => e.dates)).toEqual([
      "2025 – Present",
      "2022 – 2025",
      "2018 – 2022",
      "2014 – 2018",
      "2012 – 2014",
    ]);
  });

  it("has the current role's 4 bullets verbatim", () => {
    expect(experience[0].bullets).toEqual([
      "Monitor compliance across operational stations and track incident and risk reporting",
      "Design and maintain internal reporting systems for management visibility",
      "Analyze operational data to identify performance and process issues",
      "Lead development of internal tools to replace manual tracking processes",
    ]);
  });

  it("has no phone numbers or CV references anywhere in the data", () => {
    const json = JSON.stringify(experience).toLowerCase();
    expect(json).not.toMatch(/resume|cv download|\+233|phone/);
  });
});

describe("skills data", () => {
  it("has all 5 categories in the copy file's order", () => {
    expect(skills.map((s) => s.category)).toEqual([
      "Operations & Compliance",
      "Software Development",
      "Infrastructure & Deployment",
      "Digital & Creative",
      "Business & Leadership",
    ]);
  });

  it("has the exact item count per category from the copy file", () => {
    const counts = Object.fromEntries(skills.map((s) => [s.category, s.items.length]));
    expect(counts).toEqual({
      "Operations & Compliance": 8,
      "Software Development": 11,
      "Infrastructure & Deployment": 5,
      "Digital & Creative": 5,
      "Business & Leadership": 5,
    });
  });

  it("includes the Infrastructure item with an ampersand verbatim in the data", () => {
    expect(skills[2].items).toContain("Web server & domain configuration");
  });
});

describe("projects data", () => {
  it("has all 5 projects", () => {
    expect(projects).toHaveLength(5);
  });

  it("marks Opsella as the sole flagship, featured on Home", () => {
    const flagship = projects.filter((p) => p.flagship);
    expect(flagship).toHaveLength(1);
    expect(flagship[0].slug).toBe("opsella");
    expect(flagship[0].featuredOnHome).toBe(true);
  });

  it("features exactly Opsella and Daily Activity Log on Home", () => {
    const featured = projects.filter((p) => p.featuredOnHome).map((p) => p.slug).sort();
    expect(featured).toEqual(["daily-activity-log", "opsella"]);
  });

  it("has the exact status strings from the copy file", () => {
    const statuses = Object.fromEntries(projects.map((p) => [p.slug, p.status]));
    expect(statuses).toEqual({
      "daily-activity-log": "Live",
      "incident-reporter": "78% complete",
      gearhub: "70% complete",
      opsella: "87% complete",
      "dreamhome-cms": "70% complete",
    });
  });

  it("gives every project a 16:9-ready image placeholder with copy-file guidance text", () => {
    for (const project of projects) {
      expect(project.image.src).toMatch(/^\/images\/projects\/.+\.jpg$/);
      expect(project.image.guidance.length).toBeGreaterThan(0);
    }
  });

  it("only Daily Activity Log and DreamHome CMS carry role/stack, per the copy file", () => {
    const withRole = projects.filter((p) => p.role).map((p) => p.slug).sort();
    expect(withRole).toEqual(["daily-activity-log", "dreamhome-cms"]);
  });

  it("projectStatusState maps 'Live' to live and any percentage status to progress", () => {
    expect(projectStatusState("Live")).toBe("live");
    expect(projectStatusState("87% complete")).toBe("progress");
    expect(projectStatusState("70% complete")).toBe("progress");
  });
});

describe("ventures data", () => {
  it("has exactly the 3 ventures from the copy file, no more", () => {
    expect(ventures).toHaveLength(3);
    expect(ventures.map((v) => v.name)).toEqual(["Enthrive", "DeleOps", "Opsella"]);
  });
});

describe("leadership data", () => {
  it("has the 2 items from the copy file", () => {
    expect(leadership).toEqual([
      "Volunteer, Google Developer Conference, Ghana 2025",
      "Member, Linux Accra User Group",
    ]);
  });
});

describe("education data", () => {
  it("has the 3 degrees from the copy file, without invented years", () => {
    expect(education).toHaveLength(3);
    for (const degree of education) {
      expect(degree.credential).not.toMatch(/\d{4}/);
    }
    expect(education[0]).toEqual({ credential: "MSc Computer Science", institution: "University of Ghana, Legon" });
  });

  it("has the 3 certifications from the copy file", () => {
    expect(certifications).toEqual([
      "Microsoft Technology Associate",
      "GI-KACE Data Science Certificate",
      "GI-KACE Data Analysis with Python Certificate",
    ]);
  });
});

describe("contact data", () => {
  it("has both emails labeled correctly", () => {
    expect(contact.personalEmail).toBe("machelkassah@gmail.com");
    expect(contact.businessEmail).toBe("deleoperations@gmail.com");
  });

  it("has no phone number field", () => {
    expect(contact).not.toHaveProperty("phone");
  });

  it("has a placeholder Formspree endpoint clearly marked for replacement", () => {
    expect(contact.formEndpoint).toBe("https://formspree.io/f/YOUR_FORM_ID");
  });
});
