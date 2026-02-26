import type { Certificate } from "./content-types";

const defaultImage =
  "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80";

export const certificates: Certificate[] = [
  {
    title: "AWS Certified Developer - Associate",
    issuer: "Amazon Web Services",
    date: "2024",
    description: "Validates expertise in developing and maintaining applications on AWS.",
    imageSrc: defaultImage,
    link: "#",
  },
  {
    title: "Google Professional Cloud Developer",
    issuer: "Google Cloud",
    date: "2024",
    description:
      "Demonstrates ability to build scalable, secure, and reliable cloud-native applications.",
    imageSrc: defaultImage,
    link: "#",
  },
  {
    title: "Microsoft Certified: Azure Developer Associate",
    issuer: "Microsoft",
    date: "2023",
    description:
      "Validates skills in designing, building, testing, and maintaining cloud applications.",
    imageSrc: defaultImage,
    link: "#",
  },
  {
    title: "Certified Scrum Product Owner (CSPO)",
    issuer: "Scrum Alliance",
    date: "2023",
    description: "Certification for product owners working in Agile/Scrum environments.",
    imageSrc: defaultImage,
    link: "#",
  },
  {
    title: "Oracle Certified Professional: Java SE 17 Developer",
    issuer: "Oracle",
    date: "2022",
    description:
      "Validates advanced Java programming skills and knowledge of modern Java features.",
    imageSrc: defaultImage,
    link: "#",
  },
];
