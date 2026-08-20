export interface SkillCategory {
  category: string;
  items: string[];
}

export const skills: SkillCategory[] = [
  {
    category: "Operations & Compliance",
    items: [
      "Compliance monitoring",
      "Operational risk management",
      "Incident management",
      "Process improvement",
      "Workflow design",
      "Performance monitoring",
      "SOP implementation",
      "Management reporting",
    ],
  },
  {
    category: "Software Development",
    items: [
      "AdonisJS",
      "JavaScript",
      "HTML/CSS",
      "Tailwind CSS",
      "MySQL",
      "Docker",
      "Redis",
      "Google Apps Script",
      "Chart.js",
      "Role-based access control",
      "Offline-first application design",
    ],
  },
  {
    category: "Infrastructure & Deployment",
    items: [
      "AWS Lightsail",
      "Linux",
      "Docker deployment",
      "Web server & domain configuration",
      "Database administration",
    ],
  },
  {
    category: "Digital & Creative",
    items: ["Graphic design", "Branding", "Web design", "Video production", "Social media & digital marketing"],
  },
  {
    category: "Business & Leadership",
    items: [
      "Entrepreneurship",
      "Project planning",
      "Business process design",
      "Team coordination",
      "Customer service leadership",
    ],
  },
];
