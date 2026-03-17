<script lang="ts">
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

	let currentSection: AdminSection = $state("me");
</script>

<div class="container mx-auto px-6 py-8">
	<h1 class="text-2xl font-semibold">Admin</h1>
	<div class="mt-6 flex flex-wrap gap-2">
		<Button
			class="rounded border px-3 py-1 {currentSection === 'me'
				? 'bg-primary text-primary-foreground'
				: ''}"
			on:click={() => setSection("me")}
		>
			Profile
		</Button>
		<Button
			class="rounded border px-3 py-1 {currentSection === 'projects'
				? 'bg-primary text-primary-foreground'
				: ''}"
			on:click={() => setSection("projects")}
		>
			Projects
		</Button>

		<Button
			class="rounded border px-3 py-1 {currentSection === 'blogs'
				? 'bg-primary text-primary-foreground'
				: ''}"
			on:click={() => redirect("/admin/blogs")}
		>
			Blogs
		</Button>
		<Button
			class="rounded border px-3 py-1 {currentSection === 'certificates'
				? 'bg-primary text-primary-foreground'
				: ''}"
			on:click={() => setSection("certificates")}
		>
			Certificates
		</Button>
		<Button
			class="rounded border px-3 py-1 {currentSection === 'skills'
				? 'bg-primary text-primary-foreground'
				: ''}"
			on:click={() => setSection("skills")}
		>
			Skills
		</Button>
		<Button
			class="rounded border px-3 py-1 {currentSection === 'education'
				? 'bg-primary text-primary-foreground'
				: ''}"
			on:click={() => setSection("education")}
		>
			Education
		</Button>
		<Button
			class="rounded border px-3 py-1 {currentSection === 'socials'
				? 'bg-primary text-primary-foreground'
				: ''}"
			on:click={() => setSection("socials")}
		>
			Socials
		</Button>
		<Button
			class="rounded border px-3 py-1 {currentSection === 'donations'
				? 'bg-primary text-primary-foreground'
				: ''}"
			on:click={() => setSection("donation")}
		>
			Donations
		</Button>
		<Button
			class="rounded border px-3 py-1 {currentSection === 'messages'
				? 'bg-primary text-primary-foreground'
				: ''}"
			on:click={() => setSection("messages")}
		>
			Messages
		</Button>

		<Button
			class="rounded border px-3 py-1"
			type="destructive"
			on:click={() => logout}>Logout</Button
		>
	</div>

	{#if currentSection === "me"}
		<ProfileSection profiles={data.profiles} />
	{:else if currentSection === "projects"}
		<ProjectsSection projects={data.projects} />
	{:else if currentSection === "certificates"}
		<CertificatesSection certificates={data.certificates} />
	{:else if currentSection === "skills"}
		<SkillsSection skills={data.skills} />
	{:else if currentSection === "education"}
		<EducationSection education={data.education} />
	{:else if currentSection === "socials"}
		<SocialsSection socials={data.social_links} />
	{:else if currentSection === "donations"}
		<DonationsSection donations={data.donation} />
	{:else if currentSection === "messages"}
		<ViewMessages messages={data.messages} />
	{/if}
</div>
