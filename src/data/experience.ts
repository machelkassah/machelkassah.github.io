export interface ExperienceEntry {
  company: string;
  role: string;
  dates: string;
  bullets: string[];
}

export const experience: ExperienceEntry[] = [
  {
    company: "Ghana Link Network Services",
    role: "Safety and Compliance Officer",
    dates: "2025 – Present",
    bullets: [
      "Monitor compliance across operational stations and track incident and risk reporting",
      "Design and maintain internal reporting systems for management visibility",
      "Analyze operational data to identify performance and process issues",
      "Lead development of internal tools to replace manual tracking processes",
    ],
  },
  {
    company: "Hekimax Solutions Ltd",
    role: "Operations Lead",
    dates: "2022 – 2025",
    bullets: [
      "Led operational and strategic initiatives across the organization",
      "Oversaw the launch of the Yesoko website and mobile applications",
      "Improved technical support operations and trained support technicians",
      "Managed supplier relationships and implemented server monitoring for improved reliability",
    ],
  },
  {
    company: "Hekimax Solutions Ltd",
    role: "Technical Support Manager",
    dates: "2018 – 2022",
    bullets: [],
  },
  {
    company: "Hekimax Solutions Ltd",
    role: "Sales & Customer Support Technician",
    dates: "2014 – 2018",
    bullets: [],
  },
  {
    company: "University of Education, Winneba",
    role: "Teaching Assistant",
    dates: "2012 – 2014",
    bullets: [],
  },
];
