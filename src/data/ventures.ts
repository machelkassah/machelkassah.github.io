export interface Venture {
  slug: string;
  name: string;
  description: string;
}

export const ventures: Venture[] = [
  {
    slug: "enthrive",
    name: "Enthrive",
    description: "Corporate branding, merchandise, and creative/media services based in Ghana.",
  },
  {
    slug: "deleops",
    name: "DeleOps",
    description: "Software engineering and technology products, including internal business systems and Opsella.",
  },
  {
    slug: "opsella",
    name: "Opsella",
    description: "A POS and ERP platform for small and growing businesses.",
  },
];
