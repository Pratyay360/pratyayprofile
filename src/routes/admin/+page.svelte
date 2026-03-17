<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import ProfileSection from './components/profile-section.svelte';
	import ProjectsSection from './components/projects-section.svelte';
	import CertificatesSection from './components/certificates-section.svelte';
	import SkillsSection from './components/skills-section.svelte';
	import EducationSection from './components/education-section.svelte';
	import SocialsSection from './components/socials-section.svelte';
	import DonationsSection from './components/donations-section.svelte';
	import ViewMessages from './components/view-messages.svelte';
	import { Button } from '$lib/components/ui/button';

	type AdminSection =
		| 'me'
		| 'projects'
		| 'certificates'
		| 'skills'
		| 'education'
		| 'socials'
		| 'donations'
		| 'messages';

	let { data }: { data: PageData } = $props();
	let currentSection = $state<AdminSection>('me');

	const profiles = $derived(data.profiles as { id: string; name?: string; description?: string }[]);
	const projects = $derived(data.projects as { id: string; title?: string; brief?: string; link?: string }[]);
	const certificates = $derived(
		data.certificates as { id: string; title?: string; description?: string; date?: string; link?: string }[]
	);
	const skills = $derived(data.skills as { id: string; category?: string; items?: string[] | string }[]);
	const education = $derived(data.education as {
		id: string;
		degree?: string;
		institution?: string;
		period?: string;
		description?: string;
	}[]);
	const socials = $derived(data.social_links as { id: string; name?: string; link?: string }[]);
	const donations = $derived(data.donation as { id: string; name?: string; link?: string }[]);
	const messages = $derived(data.messages as {
		id: string;
		isRead?: boolean;
		name?: string;
		email?: string;
		message?: string;
		created?: string;
	}[]);

	const setSection = (section: AdminSection) => {
		currentSection = section;
	};
</script>

<div class="container mx-auto px-6 py-8">
	<h1 class="text-2xl font-semibold">Admin</h1>

	<div class="mt-6 flex flex-wrap gap-2">
		<Button variant={currentSection === 'me' ? 'default' : 'outline'} onclick={() => setSection('me')}>
			Profile
		</Button>
		<Button
			variant={currentSection === 'projects' ? 'default' : 'outline'}
			onclick={() => setSection('projects')}
		>
			Projects
		</Button>
		<Button variant="outline" onclick={() => goto('/admin/blogs')}>Blogs</Button>
		<Button
			variant={currentSection === 'certificates' ? 'default' : 'outline'}
			onclick={() => setSection('certificates')}
		>
			Certificates
		</Button>
		<Button
			variant={currentSection === 'skills' ? 'default' : 'outline'}
			onclick={() => setSection('skills')}
		>
			Skills
		</Button>
		<Button
			variant={currentSection === 'education' ? 'default' : 'outline'}
			onclick={() => setSection('education')}
		>
			Education
		</Button>
		<Button
			variant={currentSection === 'socials' ? 'default' : 'outline'}
			onclick={() => setSection('socials')}
		>
			Socials
		</Button>
		<Button
			variant={currentSection === 'donations' ? 'default' : 'outline'}
			onclick={() => setSection('donations')}
		>
			Donations
		</Button>
		<Button
			variant={currentSection === 'messages' ? 'default' : 'outline'}
			onclick={() => setSection('messages')}
		>
			Messages
		</Button>
		<form method="POST" action="?/logout">
			<Button type="submit" variant="destructive">Logout</Button>
		</form>
	</div>

	{#if currentSection === 'me'}
		<ProfileSection {profiles} />
	{:else if currentSection === 'projects'}
		<ProjectsSection {projects} />
	{:else if currentSection === 'certificates'}
		<CertificatesSection {certificates} />
	{:else if currentSection === 'skills'}
		<SkillsSection {skills} />
	{:else if currentSection === 'education'}
		<EducationSection {education} />
	{:else if currentSection === 'socials'}
		<SocialsSection {socials} />
	{:else if currentSection === 'donations'}
		<DonationsSection {donations} />
	{:else if currentSection === 'messages'}
		<ViewMessages {messages} />
	{/if}
</div>
