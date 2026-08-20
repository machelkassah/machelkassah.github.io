export interface Degree {
  credential: string;
  institution: string;
}

export const education: Degree[] = [
  { credential: "MSc Computer Science", institution: "University of Ghana, Legon" },
  { credential: "BSc Information Technology Education", institution: "University of Education, Winneba" },
  { credential: "Certificate in Information Technology", institution: "Ghana Telecom University College" },
];

export const certifications: string[] = [
  "Microsoft Technology Associate",
  "GI-KACE Data Science Certificate",
  "GI-KACE Data Analysis with Python Certificate",
];
