export type Project = {
  imageUrl: string;
  title: string;
  brief: string;
  link: string;
};

export type Certificate = {
  title: string;
  description: string;
  date: string;
  imageSrc: string;
  link: string;
  issuer?: string;
};

export type SkillCategory = {
  category: string;
  items: string[];
};

export type EducationEntry = {
  degree: string;
  institution: string;
  location: string;
  period: string;
  description: string;
};

export type SocialLink = {
  name: string;
  image: string;
  link: string;
};

export type Donation = {
  name: string;
  image: string;
  link: string;
};

export type PortfolioContent = {
  projects: Project[];
  certificates: Certificate[];
  skills: SkillCategory[];
  education: EducationEntry[];
  aboutMe: string;
  photo: {
    name: string;
    title: string;
    imageUrl: string;
  };
  resumeUrl: string;
  socialLinks: SocialLink[];
  donations: Donation[];
  hashnodeHost: string;
};
