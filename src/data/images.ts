export interface ImageSlot {
  src: string;
  alt: string;
  guidance: string;
  aspect: string;
}

export const heroImage: ImageSlot = {
  src: "/images/hero-portrait.jpg",
  alt: "Professional headshot of Machel Kassah, front-facing, neutral background",
  guidance:
    "Professional headshot, front-facing, neutral or softly blurred background, good lighting. Suggested crop: square or 4:5 portrait, at least 1200px on the short side.",
  aspect: "4/5",
};

export const aboutSecondaryImage: ImageSlot = {
  src: "/images/about-secondary.jpg",
  alt: "Candid working-context photo of Machel Kassah, at a desk, at a station, or presenting",
  guidance:
    "A more candid, working-context shot — at a desk, at a station, or presenting — to add texture beyond the hero headshot.",
  aspect: "4/5",
};
