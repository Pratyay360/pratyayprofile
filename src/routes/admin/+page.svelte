<script lang="ts">
	import { enhance } from "$app/forms";
	import { goto } from "$app/navigation";
	import type { PageData } from "./$types";
	import ProfileSection from "./components/profile-section.svelte";
	import ProjectsSection from "./components/projects-section.svelte";
	import CertificatesSection from "./components/certificates-section.svelte";
	import SkillsSection from "./components/skills-section.svelte";
	import EducationSection from "./components/education-section.svelte";
	import SocialsSection from "./components/socials-section.svelte";
	import DonationsSection from "./components/donations-section.svelte";
	import ViewMessages from "./components/view-messages.svelte";
	import { Button } from "$lib/components/ui/button";

	type AdminSection =
		| "me"
		| "projects"
		| "certificates"
		| "skills"
		| "education"
		| "socials"
		| "donations"
		| "messages";

	let { data }: { data: PageData } = $props();
	let currentSection: AdminSection = $state("me");

	const setSection = (section: AdminSection) => {
		currentSection = section;
	};

	const profiles = $derived(data.profiles as any[]);
	const projects = $derived(data.projects as any[]);
	const certificates = $derived(data.certificates as any[]);
	const skills = $derived(data.skills as any[]);
	const education = $derived(data.education as any[]);
	const socials = $derived(data.social_links as any[]);
	const donations = $derived(data.donation as any[]);
	const messages = $derived(data.messages as any[]);
</script>

<div class="container mx-auto px-6 py-8">
	<h1 class="text-2xl font-semibold">Admin</h1>
	<div class="mt-6 flex flex-wrap gap-2">
		<Button
			class="rounded border px-3 py-1 {currentSection === 'me'
				? 'bg-primary text-primary-foreground'
				: ''}"
			onclick={() => setSection("me")}
		>
			Profile
		</Button>
		<Button
			class="rounded border px-3 py-1 {currentSection === 'projects'
				? 'bg-primary text-primary-foreground'
				: ''}"
			onclick={() => setSection("projects")}
		>
			Projects
		</Button>

		<Button
			class="rounded border px-3 py-1"
			onclick={() => goto("/admin/blogs")}
		>
			Blogs
		</Button>
		<Button
			class="rounded border px-3 py-1 {currentSection === 'certificates'
				? 'bg-primary text-primary-foreground'
				: ''}"
			onclick={() => setSection("certificates")}
		>
			Certificates
		</Button>
		<Button
			class="rounded border px-3 py-1 {currentSection === 'skills'
				? 'bg-primary text-primary-foreground'
				: ''}"
			onclick={() => setSection("skills")}
		>
			Skills
		</Button>
		<Button
			class="rounded border px-3 py-1 {currentSection === 'education'
				? 'bg-primary text-primary-foreground'
				: ''}"
			onclick={() => setSection("education")}
		>
			Education
		</Button>
		<Button
			class="rounded border px-3 py-1 {currentSection === 'socials'
				? 'bg-primary text-primary-foreground'
				: ''}"
			onclick={() => setSection("socials")}
		>
			Socials
		</Button>
		<Button
			class="rounded border px-3 py-1 {currentSection === 'donations'
				? 'bg-primary text-primary-foreground'
				: ''}"
			onclick={() => setSection("donations")}
		>
			Donations
		</Button>
		<Button
			class="rounded border px-3 py-1 {currentSection === 'messages'
				? 'bg-primary text-primary-foreground'
				: ''}"
			onclick={() => setSection("messages")}
		>
			Messages
		</Button>

		<form method="POST" action="?/logout" use:enhance>
			<Button class="rounded border px-3 py-1" type="submit" variant="destructive">
				Logout
			</Button>
		</form>
	</div>

	{#if currentSection === "me"}
		<ProfileSection profiles={profiles} />
	{:else if currentSection === "projects"}
		<ProjectsSection projects={projects} />
	{:else if currentSection === "certificates"}
		<CertificatesSection certificates={certificates} />
	{:else if currentSection === "skills"}
		<SkillsSection skills={skills} />
	{:else if currentSection === "education"}
		<EducationSection education={education} />
	{:else if currentSection === "socials"}
		<SocialsSection socials={socials} />
	{:else if currentSection === "donations"}
		<DonationsSection donations={donations} />
	{:else if currentSection === "messages"}
		<ViewMessages messages={messages} />
	{/if}
</div>
