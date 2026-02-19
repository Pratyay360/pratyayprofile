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

export type PortfolioContent = {
	projects: Project[];
	certificates: Certificate[];
	skills: SkillCategory[];
	education: EducationEntry[];
};
