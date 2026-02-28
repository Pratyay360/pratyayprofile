<script lang="ts">
	import type { PageData } from './$types';
	import ProfileSection from './components/profile-section.svelte';
	import ProjectsSection from './components/projects-section.svelte';
	import CertificatesSection from './components/certificates-section.svelte';
	import SkillsSection from './components/skills-section.svelte';
	import EducationSection from './components/education-section.svelte';
	import SocialsSection from './components/socials-section.svelte';
	import DonationsSection from './components/donations-section.svelte';

	export let data: PageData;

	type AdminSection =
		| 'profile'
		| 'projects'
		| 'certificates'
		| 'skills'
		| 'education'
		| 'socials'
		| 'donations';

	let currentSection: AdminSection = 'profile';

	function setSection(section: AdminSection): void {
		currentSection = section;
	}
</script>

<div class="container mx-auto px-6 py-8">
	<h1 class="text-2xl font-semibold">Admin</h1>

	<div class="mt-6 flex flex-wrap gap-2">
		<button
			class="rounded border px-3 py-1 {currentSection === 'profile'
				? 'bg-primary text-primary-foreground'
				: ''}"
			onclick={() => setSection('profile')}
		>
			Profile
		</button>
		<button
			class="rounded border px-3 py-1 {currentSection === 'projects'
				? 'bg-primary text-primary-foreground'
				: ''}"
			onclick={() => setSection('projects')}
		>
			Projects
		</button>
		<button
			class="rounded border px-3 py-1 {currentSection === 'certificates'
				? 'bg-primary text-primary-foreground'
				: ''}"
			onclick={() => setSection('certificates')}
		>
			Certificates
		</button>
		<button
			class="rounded border px-3 py-1 {currentSection === 'skills'
				? 'bg-primary text-primary-foreground'
				: ''}"
			onclick={() => setSection('skills')}
		>
			Skills
		</button>
		<button
			class="rounded border px-3 py-1 {currentSection === 'education'
				? 'bg-primary text-primary-foreground'
				: ''}"
			onclick={() => setSection('education')}
		>
			Education
		</button>
		<button
			class="rounded border px-3 py-1 {currentSection === 'socials'
				? 'bg-primary text-primary-foreground'
				: ''}"
			onclick={() => setSection('socials')}
		>
			Socials
		</button>
		<button
			class="rounded border px-3 py-1 {currentSection === 'donations'
				? 'bg-primary text-primary-foreground'
				: ''}"
			onclick={() => setSection('donations')}
		>
			Donations
		</button>
		<form method="POST" action="?/logout" class="inline">
			<button class="rounded border px-3 py-1" type="submit">Logout</button>
		</form>
	</div>

	{#if currentSection === 'profile'}
		<ProfileSection profiles={data.profiles} />
	{:else if currentSection === 'projects'}
		<ProjectsSection projects={data.projects} />
	{:else if currentSection === 'certificates'}
		<CertificatesSection certificates={data.certificates} />
	{:else if currentSection === 'skills'}
		<SkillsSection skills={data.skills} />
	{:else if currentSection === 'education'}
		<EducationSection education={data.education} />
	{:else if currentSection === 'socials'}
		<SocialsSection socials={data.socials} />
	{:else if currentSection === 'donations'}
		<DonationsSection donations={data.donations} />
	{/if}
</div>
