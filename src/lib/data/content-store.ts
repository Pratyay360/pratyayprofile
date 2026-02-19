import { browser } from '$app/environment';
import { get, writable } from 'svelte/store';
import { certificates as defaultCertificates } from './certificates';
import { education as defaultEducation } from './education';
import { projects as defaultProjects } from './projects';
import { skills as defaultSkills } from './skills';
import type { Certificate, EducationEntry, PortfolioContent, Project, SkillCategory } from './content-types';

const STORAGE_KEY = 'portfolio-content-v1';

const deepClone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const defaults: PortfolioContent = {
	projects: deepClone(defaultProjects),
	certificates: deepClone(defaultCertificates),
	skills: deepClone(defaultSkills),
	education: deepClone(defaultEducation)
};

export const projectsStore = writable<Project[]>(deepClone(defaults.projects));
export const certificatesStore = writable<Certificate[]>(deepClone(defaults.certificates));
export const skillsStore = writable<SkillCategory[]>(deepClone(defaults.skills));
export const educationStore = writable<EducationEntry[]>(deepClone(defaults.education));

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

const currentContent = (): PortfolioContent => ({
	projects: deepClone(get(projectsStore)),
	certificates: deepClone(get(certificatesStore)),
	skills: deepClone(get(skillsStore)),
	education: deepClone(get(educationStore))
});

const applyContent = (content: PortfolioContent): void => {
	projectsStore.set(deepClone(content.projects));
	certificatesStore.set(deepClone(content.certificates));
	skillsStore.set(deepClone(content.skills));
	educationStore.set(deepClone(content.education));
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
			education: normalizeEducation(parsed.education)
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

export const resetContentStore = (): void => {
	applyContent(deepClone(defaults));
	persistContent();
};
