export interface ImageSlot {
  src: string;
  alt: string;
  guidance: string;
  aspect: string;
}

export const heroImage: ImageSlot = {
  src: "/images/hero-portrait.png",
  alt: "Portrait of Machel Kassah, high-angle studio shot, wearing glasses and a rust-brown overshirt against a dark background",
  guidance:
    "Professional headshot, front-facing, neutral or softly blurred background, good lighting. Suggested crop: square or 4:5 portrait, at least 1200px on the short side.",
  aspect: "864/1184",
};

export const aboutSecondaryImage: ImageSlot = {
  src: "/images/about-secondary.jpg",
  alt: "Candid photo of Machel Kassah speaking into a microphone at an event, wearing a black shirt",
  guidance:
    "A more candid, working-context shot — at a desk, at a station, or presenting — to add texture beyond the hero headshot.",
  aspect: "736/1080",
};
