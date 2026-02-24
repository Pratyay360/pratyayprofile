<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { initContentStore, resetContentStore } from '$lib/data/content-store';
	import { aboutMeStore, photoStore, hashnodeHostStore } from '$lib/data/content-store';
	import { authorized, currentSection, setStatus, setAuthorized, setSection } from './admin-store';
	import { statusMessage } from './admin-store';

	import ProfileSection from './components/profile-section.svelte';
	import ProjectsSection from './components/projects-section.svelte';
	import CertificatesSection from './components/certificates-section.svelte';
	import SkillsSection from './components/skills-section.svelte';
	import EducationSection from './components/education-section.svelte';
	import SocialsSection from './components/socials-section.svelte';
	import DonationsSection from './components/donations-section.svelte';

	type Section =
		| 'profile'
		| 'projects'
		| 'certificates'
		| 'skills'
		| 'education'
		| 'socials'
		| 'donations';

	const pass = import.meta.env.VITE_PASS ?? '';
	let input = '';

	onMount(() => {
		initContentStore();
		const stored = localStorage.getItem('pass') ?? '';
		const isAuthorized = pass !== '' && stored === pass;
		authorized.set(isAuthorized);

		// Redirect to login if not authorized
		if (!isAuthorized) {
			goto('/admin/login');
		}
	});

	function handleSubmit(event: SubmitEvent): void {
		event.preventDefault();
		localStorage.setItem('pass', input);
		const isAuthorized = pass !== '' && input === pass;
		authorized.set(isAuthorized);
		setStatus(isAuthorized ? 'Authorized.' : 'Invalid password.');
		
		if (isAuthorized) {
			goto('/admin');
		}
	}

	function logout(): void {
		localStorage.removeItem('pass');
		authorized.set(false);
		input = '';
		setStatus('Logged out.');
		goto('/admin/login');
	}

	function handleResetData(): void {
		if (!window.confirm('Reset all admin content to defaults?')) return;
		resetContentStore();
		$aboutMeStore;
		$photoStore;
		$hashnodeHostStore;
		setStatus('All content reset to defaults.');
	}
</script>

<div class="container mx-auto px-6 py-8">
	<h1 class="text-2xl font-semibold">Admin</h1>

	{#if !$authorized}
		<form onsubmit={handleSubmit} class="mt-6 max-w-sm space-y-3">
			<label for="pass" class="block text-sm font-medium">Password</label>
			<input
				id="pass"
				type="password"
				class="w-full rounded border p-2 text-black"
				bind:value={input}
				required
			/>
			<button class="rounded-md border px-4 py-2" type="submit">Login</button>
			<p class="text-sm text-muted-foreground">Login to manage portfolio content.</p>
			{#if $statusMessage}
				<p class="text-sm">{$statusMessage}</p>
			{/if}
		</form>
	{:else}
		<div class="mt-6 flex flex-wrap gap-2">
			<button
				class="rounded border px-3 py-1 {$currentSection === 'profile'
					? 'bg-primary text-primary-foreground'
					: ''}"
				onclick={() => setSection('profile')}
			>
				Profile
			</button>
			<button
				class="rounded border px-3 py-1 {$currentSection === 'projects'
					? 'bg-primary text-primary-foreground'
					: ''}"
				onclick={() => setSection('projects')}
			>
				Projects
			</button>
			<button
				class="rounded border px-3 py-1 {$currentSection === 'certificates'
					? 'bg-primary text-primary-foreground'
					: ''}"
				onclick={() => setSection('certificates')}
			>
				Certificates
			</button>
			<button
				class="rounded border px-3 py-1 {$currentSection === 'skills'
					? 'bg-primary text-primary-foreground'
					: ''}"
				onclick={() => setSection('skills')}
			>
				Skills
			</button>
			<button
				class="rounded border px-3 py-1 {$currentSection === 'education'
					? 'bg-primary text-primary-foreground'
					: ''}"
				onclick={() => setSection('education')}
			>
				Education
			</button>
			<button
				class="rounded border px-3 py-1 {$currentSection === 'socials'
					? 'bg-primary text-primary-foreground'
					: ''}"
				onclick={() => setSection('socials')}
			>
				Socials
			</button>
			<button
				class="rounded border px-3 py-1 {$currentSection === 'donations'
					? 'bg-primary text-primary-foreground'
					: ''}"
				onclick={() => setSection('donations')}
			>
				Donations
			</button>
			<button class="rounded border px-3 py-1" onclick={handleResetData}>Reset Defaults</button>
			<button class="rounded border px-3 py-1" onclick={logout}>Logout</button>
		</div>

		{#if $statusMessage}
			<p class="mt-3 text-sm text-muted-foreground">{$statusMessage}</p>
		{/if}

		{#if $currentSection === 'profile'}
			<ProfileSection />
		{:else if $currentSection === 'projects'}
			<ProjectsSection />
		{:else if $currentSection === 'certificates'}
			<CertificatesSection />
		{:else if $currentSection === 'skills'}
			<SkillsSection />
		{:else if $currentSection === 'education'}
			<EducationSection />
		{:else if $currentSection === 'socials'}
			<SocialsSection />
		{:else if $currentSection === 'donations'}
			<DonationsSection />
		{/if}
	{/if}
</div>
