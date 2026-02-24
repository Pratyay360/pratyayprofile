import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';
import type {
	Certificate,
	Donation,
	EducationEntry,
	PortfolioContent,
	Project,
	SkillCategory,
	SocialLink
} from './content-types';

/**
 * This file provides a local content store for a portfolio.
 * Personal / real data has been replaced with generic placeholder content.
 */

const STORAGE_KEY = 'portfolio-content-v1';

const deepClone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

/* Placeholder data (replaces any personal data) */
const placeholderImage =
	'https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1200&q=80';

const placeholderProjects: Project[] = [
	{
		imageUrl: placeholderImage,
		title: 'Sample Project A',
		brief: 'A sample project demonstrating core concepts and layout.',
		link: 'https://example.com/project-a'
	},
	{
		imageUrl: placeholderImage,
		title: 'Sample Project B',
		brief: 'Another example project showcasing functionality.',
		link: 'https://example.com/project-b'
	},
	{
		imageUrl: placeholderImage,
		title: 'Sample Project C',
		brief: 'A demonstration project for visuals and interactivity.',
		link: 'https://example.com/project-c'
	}
];

const placeholderCertificates: Certificate[] = [
	{
		title: 'Sample Certificate 1',
		issuer: 'Example Institute',
		date: '2023',
		description: 'Placeholder certificate for demonstration purposes.',
		imageSrc: placeholderImage,
		link: '#'
	},
	{
		title: 'Sample Certificate 2',
		issuer: 'Example Institute',
		date: '2022',
		description: 'Another placeholder certificate.',
		imageSrc: placeholderImage,
		link: '#'
	}
];

const placeholderSkills: SkillCategory[] = [
	{
		category: 'Languages',
		items: ['TypeScript', 'JavaScript', 'Python']
	},
	{
		category: 'Frontend',
		items: ['Svelte', 'HTML', 'CSS']
	},
	{
		category: 'Tools',
		items: ['Git', 'Vite', 'Testing']
	}
];

const placeholderEducation: EducationEntry[] = [
	{
		degree: 'Bachelor of Example Studies',
		institution: 'Example University',
		location: 'Example City',
		period: '2016 - 2020',
		description: 'Placeholder education entry used for demo purposes.'
	}
];

const placeholderSocialLinks: SocialLink[] = [
	{ name: 'Website', image: '', link: 'https://example.com' },
	{ name: 'GitHub', image: '', link: 'https://example.com/github' }
];

const placeholderDonations: Donation[] = [];

const defaults: PortfolioContent = {
	projects: deepClone(placeholderProjects),
	certificates: deepClone(placeholderCertificates),
	skills: deepClone(placeholderSkills),
	education: deepClone(placeholderEducation),
	aboutMe:
		'I am a developer who builds accessible and maintainable web experiences. This is placeholder text — replace it with your own summary.',
	photo: {
		name: 'Your Name',
		title: 'Your Title',
		imageUrl: ''
	},
	resumeUrl: 'https://example.com/resume.pdf',
	socialLinks: deepClone(placeholderSocialLinks),
	donations: deepClone(placeholderDonations),
	hashnodeHost: 'example.hashnode.dev'
};

/* Svelte stores */
export const projectsStore = writable<Project[]>(deepClone(defaults.projects));
export const certificatesStore = writable<Certificate[]>(deepClone(defaults.certificates));
export const skillsStore = writable<SkillCategory[]>(deepClone(defaults.skills));
export const educationStore = writable<EducationEntry[]>(deepClone(defaults.education));
export const aboutMeStore = writable<string>(defaults.aboutMe);
export const photoStore = writable<{ name: string; title: string; imageUrl: string }>(
	deepClone(defaults.photo)
);
export const resumeUrlStore = writable<string>(defaults.resumeUrl);
export const socialLinksStore = writable<SocialLink[]>(deepClone(defaults.socialLinks));
export const donationsStore = writable<Donation[]>(deepClone(defaults.donations));
export const hashnodeHostStore = writable<string>(defaults.hashnodeHost);

let initialized = false;

const cleanString = (value: unknown): string => (typeof value === 'string' ? value : '');

const normalizeProjects = (value: unknown): Project[] => {
	if (!Array.isArray(value)) return deepClone(defaults.projects);
	return value
		.map((item) => ({
			imageUrl: cleanString((item as Record<string, unknown>)?.imageUrl),
			title: cleanString((item as Record<string, unknown>)?.title),
			brief: cleanString((item as Record<string, unknown>)?.brief),
			link: cleanString((item as Record<string, unknown>)?.link)
		}))
		.filter((item) => item.title.trim() !== '');
};

const normalizeCertificates = (value: unknown): Certificate[] => {
	if (!Array.isArray(value)) return deepClone(defaults.certificates);
	return value
		.map((item) => ({
			title: cleanString((item as Record<string, unknown>)?.title),
			description: cleanString((item as Record<string, unknown>)?.description),
			date: cleanString((item as Record<string, unknown>)?.date),
			imageSrc: cleanString((item as Record<string, unknown>)?.imageSrc),
			link: cleanString((item as Record<string, unknown>)?.link),
			issuer: cleanString((item as Record<string, unknown>)?.issuer)
		}))
		.filter((item) => item.title.trim() !== '');
};

const normalizeSkills = (value: unknown): SkillCategory[] => {
	if (!Array.isArray(value)) return deepClone(defaults.skills);
	return value
		.map((item) => {
			const raw = item as Record<string, unknown>;
			const rawItems = raw.items;
			return {
				category: cleanString(raw.category),
				items: Array.isArray(rawItems)
					? rawItems.map((skill: unknown) => cleanString(skill).trim()).filter(Boolean)
					: []
			};
		})
		.filter((item) => item.category.trim() !== '');
};

const normalizeEducation = (value: unknown): EducationEntry[] => {
	if (!Array.isArray(value)) return deepClone(defaults.education);
	return value
		.map((item) => ({
			degree: cleanString((item as Record<string, unknown>)?.degree),
			institution: cleanString((item as Record<string, unknown>)?.institution),
			location: cleanString((item as Record<string, unknown>)?.location),
			period: cleanString((item as Record<string, unknown>)?.period),
			description: cleanString((item as Record<string, unknown>)?.description)
		}))
		.filter((item) => item.degree.trim() !== '');
};

const normalizeSocialLinks = (value: unknown): SocialLink[] => {
	if (!Array.isArray(value)) return deepClone(defaults.socialLinks);
	return value.map((item) => ({
		name: cleanString((item as Record<string, unknown>)?.name),
		image: cleanString((item as Record<string, unknown>)?.image),
		link: cleanString((item as Record<string, unknown>)?.link)
	}));
};

const normalizeDonations = (value: unknown): Donation[] => {
	if (!Array.isArray(value)) return deepClone(defaults.donations);
	return value.map((item) => ({
		name: cleanString((item as Record<string, unknown>)?.name),
		image: cleanString((item as Record<string, unknown>)?.image),
		link: cleanString((item as Record<string, unknown>)?.link)
	}));
};

const currentContent = (): PortfolioContent => ({
	projects: deepClone(get(projectsStore)),
	certificates: deepClone(get(certificatesStore)),
	skills: deepClone(get(skillsStore)),
	education: deepClone(get(educationStore)),
	aboutMe: get(aboutMeStore),
	photo: deepClone(get(photoStore)),
	resumeUrl: get(resumeUrlStore),
	socialLinks: deepClone(get(socialLinksStore)),
	donations: deepClone(get(donationsStore)),
	hashnodeHost: get(hashnodeHostStore)
});

const applyContent = (content: PortfolioContent): void => {
	projectsStore.set(deepClone(content.projects));
	certificatesStore.set(deepClone(content.certificates));
	skillsStore.set(deepClone(content.skills));
	educationStore.set(deepClone(content.education));
	aboutMeStore.set(content.aboutMe);
	photoStore.set(deepClone(content.photo));
	resumeUrlStore.set(content.resumeUrl);
	socialLinksStore.set(deepClone(content.socialLinks));
	donationsStore.set(deepClone(content.donations));
	hashnodeHostStore.set(content.hashnodeHost);
};

const persistContent = (): void => {
	if (!browser) return;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(currentContent()));
};

export const initContentStore = (): void => {
	if (!browser || initialized) return;
	initialized = true;

	const raw = localStorage.getItem(STORAGE_KEY);
	if (!raw) {
		persistContent();
		return;
	}

	try {
		const parsed = JSON.parse(raw) as Partial<PortfolioContent>;
		applyContent({
			projects: normalizeProjects(parsed.projects),
			certificates: normalizeCertificates(parsed.certificates),
			skills: normalizeSkills(parsed.skills),
			education: normalizeEducation(parsed.education),
			aboutMe: cleanString(parsed.aboutMe) || defaults.aboutMe,
			photo: {
				name: cleanString((parsed.photo as Record<string, unknown>)?.name) || defaults.photo.name,
				title:
					cleanString((parsed.photo as Record<string, unknown>)?.title) || defaults.photo.title,
				imageUrl: cleanString((parsed.photo as Record<string, unknown>)?.imageUrl)
			},
			resumeUrl: cleanString(parsed.resumeUrl) || defaults.resumeUrl,
			socialLinks: normalizeSocialLinks(parsed.socialLinks),
			donations: normalizeDonations(parsed.donations),
			hashnodeHost: cleanString(parsed.hashnodeHost) || defaults.hashnodeHost
		});
	} catch {
		applyContent(deepClone(defaults));
		persistContent();
	}
};

export const setProjects = (items: Project[]): void => {
	projectsStore.set(deepClone(items));
	persistContent();
};

export const setCertificates = (items: Certificate[]): void => {
	certificatesStore.set(deepClone(items));
	persistContent();
};

export const setSkills = (items: SkillCategory[]): void => {
	skillsStore.set(deepClone(items));
	persistContent();
};

export const setEducation = (items: EducationEntry[]): void => {
	educationStore.set(deepClone(items));
	persistContent();
};

export const setAboutMe = (value: string): void => {
	aboutMeStore.set(value);
	persistContent();
};

export const setPhoto = (value: { name: string; title: string; imageUrl: string }): void => {
	photoStore.set(deepClone(value));
	persistContent();
};

export const setResumeUrl = (value: string): void => {
	resumeUrlStore.set(value);
	persistContent();
};

export const setSocialLinks = (items: SocialLink[]): void => {
	socialLinksStore.set(deepClone(items));
	persistContent();
};

export const setDonations = (items: Donation[]): void => {
	donationsStore.set(deepClone(items));
	persistContent();
};

export const setHashnodeHost = (value: string): void => {
	hashnodeHostStore.set(value);
	persistContent();
};

export const resetContentStore = (): void => {
	applyContent(deepClone(defaults));
	persistContent();
};
