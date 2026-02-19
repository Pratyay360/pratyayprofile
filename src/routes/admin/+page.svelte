<script lang="ts">
	import { onMount } from 'svelte';
	import {
		certificatesStore,
		educationStore,
		initContentStore,
		projectsStore,
		resetContentStore,
		setCertificates,
		setEducation,
		setProjects,
		setSkills,
		skillsStore
	} from '$lib/data/content-store';
	import type { Certificate, EducationEntry, Project, SkillCategory } from '$lib/data/content-types';

	type Section = 'projects' | 'certificates' | 'skills' | 'education';

	const pass = import.meta.env.VITE_PASS ?? '';

	let input = '';
	let authorized = false;
	let section: Section = 'projects';
	let statusMessage = '';

	let projectForm: Project = {
		imageUrl: '',
		title: '',
		brief: '',
		link: ''
	};
	let projectEditingIndex: number | null = null;

	let certificateForm: Certificate = {
		title: '',
		description: '',
		date: '',
		imageSrc: '',
		link: '',
		issuer: ''
	};
	let certificateEditingIndex: number | null = null;

	let skillForm: SkillCategory = {
		category: '',
		items: []
	};
	let skillItemsInput = '';
	let skillEditingIndex: number | null = null;

	let educationForm: EducationEntry = {
		degree: '',
		institution: '',
		location: '',
		period: '',
		description: ''
	};
	let educationEditingIndex: number | null = null;

	onMount(() => {
		initContentStore();
		const stored = localStorage.getItem('pass') ?? '';
		authorized = pass !== '' && stored === pass;
	});

	function setStatus(message: string): void {
		statusMessage = message;
	}

	function handleSubmit(event: SubmitEvent): void {
		event.preventDefault();
		localStorage.setItem('pass', input);
		authorized = pass !== '' && input === pass;
		setStatus(authorized ? 'Authorized.' : 'Invalid password.');
	}

	function logout(): void {
		localStorage.removeItem('pass');
		authorized = false;
		input = '';
		setStatus('Logged out.');
	}

	function resetProjectForm(): void {
		projectForm = { imageUrl: '', title: '', brief: '', link: '' };
		projectEditingIndex = null;
	}

	function saveProject(event: SubmitEvent): void {
		event.preventDefault();
		if (!projectForm.title.trim()) {
			setStatus('Project title is required.');
			return;
		}

		const next = [...$projectsStore];
		if (projectEditingIndex === null) {
			next.push({ ...projectForm });
			setStatus('Project added.');
		} else {
			next[projectEditingIndex] = { ...projectForm };
			setStatus('Project updated.');
		}
		setProjects(next);
		resetProjectForm();
	}

	function editProject(index: number): void {
		projectForm = { ...$projectsStore[index] };
		projectEditingIndex = index;
		setStatus('Editing project.');
	}

	function removeProject(index: number): void {
		setProjects($projectsStore.filter((_, i) => i !== index));
		if (projectEditingIndex === index) {
			resetProjectForm();
		}
		setStatus('Project removed.');
	}

	function resetCertificateForm(): void {
		certificateForm = { title: '', description: '', date: '', imageSrc: '', link: '', issuer: '' };
		certificateEditingIndex = null;
	}

	function saveCertificate(event: SubmitEvent): void {
		event.preventDefault();
		if (!certificateForm.title.trim()) {
			setStatus('Certificate title is required.');
			return;
		}

		const next = [...$certificatesStore];
		if (certificateEditingIndex === null) {
			next.push({ ...certificateForm });
			setStatus('Certificate added.');
		} else {
			next[certificateEditingIndex] = { ...certificateForm };
			setStatus('Certificate updated.');
		}
		setCertificates(next);
		resetCertificateForm();
	}

	function editCertificate(index: number): void {
		certificateForm = { ...$certificatesStore[index] };
		certificateEditingIndex = index;
		setStatus('Editing certificate.');
	}

	function removeCertificate(index: number): void {
		setCertificates($certificatesStore.filter((_, i) => i !== index));
		if (certificateEditingIndex === index) {
			resetCertificateForm();
		}
		setStatus('Certificate removed.');
	}

	function resetSkillForm(): void {
		skillForm = { category: '', items: [] };
		skillItemsInput = '';
		skillEditingIndex = null;
	}

	function saveSkill(event: SubmitEvent): void {
		event.preventDefault();
		if (!skillForm.category.trim()) {
			setStatus('Skill category is required.');
			return;
		}

		const payload: SkillCategory = {
			category: skillForm.category,
			items: skillItemsInput
				.split(',')
				.map((item) => item.trim())
				.filter(Boolean)
		};

		const next = [...$skillsStore];
		if (skillEditingIndex === null) {
			next.push(payload);
			setStatus('Skill category added.');
		} else {
			next[skillEditingIndex] = payload;
			setStatus('Skill category updated.');
		}
		setSkills(next);
		resetSkillForm();
	}

	function editSkill(index: number): void {
		skillForm = { ...$skillsStore[index] };
		skillItemsInput = $skillsStore[index].items.join(', ');
		skillEditingIndex = index;
		setStatus('Editing skill category.');
	}

	function removeSkill(index: number): void {
		setSkills($skillsStore.filter((_, i) => i !== index));
		if (skillEditingIndex === index) {
			resetSkillForm();
		}
		setStatus('Skill category removed.');
	}

	function resetEducationForm(): void {
		educationForm = { degree: '', institution: '', location: '', period: '', description: '' };
		educationEditingIndex = null;
	}

	function saveEducation(event: SubmitEvent): void {
		event.preventDefault();
		if (!educationForm.degree.trim()) {
			setStatus('Degree is required.');
			return;
		}

		const next = [...$educationStore];
		if (educationEditingIndex === null) {
			next.push({ ...educationForm });
			setStatus('Education entry added.');
		} else {
			next[educationEditingIndex] = { ...educationForm };
			setStatus('Education entry updated.');
		}
		setEducation(next);
		resetEducationForm();
	}

	function editEducation(index: number): void {
		educationForm = { ...$educationStore[index] };
		educationEditingIndex = index;
		setStatus('Editing education entry.');
	}

	function removeEducation(index: number): void {
		setEducation($educationStore.filter((_, i) => i !== index));
		if (educationEditingIndex === index) {
			resetEducationForm();
		}
		setStatus('Education entry removed.');
	}

	function handleResetData(): void {
		if (!window.confirm('Reset all admin content to defaults?')) return;
		resetContentStore();
		resetProjectForm();
		resetCertificateForm();
		resetSkillForm();
		resetEducationForm();
		setStatus('All content reset to defaults.');
	}
</script>

<div class="container mx-auto px-6 py-8">
	<h1 class="text-2xl font-semibold">Admin</h1>

	{#if !authorized}
		<form onsubmit={handleSubmit} class="mt-6 max-w-sm space-y-3">
			<label for="pass" class="block text-sm font-medium">Password</label>
			<input
				id="pass"
				type="password"
				class="w-full rounded border p-2"
				bind:value={input}
				required
			/>
			<button class="rounded-md border px-4 py-2" type="submit">Login</button>
			<p class="text-sm text-muted-foreground">Login to manage portfolio content.</p>
			{#if statusMessage}
				<p class="text-sm">{statusMessage}</p>
			{/if}
		</form>
	{:else}
		<div class="mt-6 flex flex-wrap gap-2">
			<button class="rounded border px-3 py-1" onclick={() => (section = 'projects')}>Projects</button>
			<button class="rounded border px-3 py-1" onclick={() => (section = 'certificates')}>
				Certificates
			</button>
			<button class="rounded border px-3 py-1" onclick={() => (section = 'skills')}>Skills</button>
			<button class="rounded border px-3 py-1" onclick={() => (section = 'education')}>Education</button>
			<button class="rounded border px-3 py-1" onclick={handleResetData}>Reset Defaults</button>
			<button class="rounded border px-3 py-1" onclick={logout}>Logout</button>
		</div>

		{#if statusMessage}
			<p class="mt-3 text-sm text-muted-foreground">{statusMessage}</p>
		{/if}

		{#if section === 'projects'}
			<div class="mt-6 grid gap-6 lg:grid-cols-2">
				<form onsubmit={saveProject} class="space-y-3 rounded border p-4">
					<h2 class="text-lg font-medium">
						{projectEditingIndex === null ? 'Add Project' : 'Edit Project'}
					</h2>
					<input class="w-full rounded border p-2" placeholder="Title" bind:value={projectForm.title} />
					<input
						class="w-full rounded border p-2"
						placeholder="Image URL"
						bind:value={projectForm.imageUrl}
					/>
					<input class="w-full rounded border p-2" placeholder="Project Link" bind:value={projectForm.link} />
					<textarea
						class="w-full rounded border p-2"
						placeholder="Brief"
						rows="4"
						bind:value={projectForm.brief}
					></textarea>
					<div class="flex gap-2">
						<button class="rounded border px-4 py-2" type="submit">
							{projectEditingIndex === null ? 'Add' : 'Update'}
						</button>
						{#if projectEditingIndex !== null}
							<button class="rounded border px-4 py-2" type="button" onclick={resetProjectForm}>
								Cancel
							</button>
						{/if}
					</div>
				</form>

				<div class="space-y-2 rounded border p-4">
					<h2 class="text-lg font-medium">Current Projects</h2>
					{#each $projectsStore as item, index (item.title + index)}
						<div class="rounded border p-3">
							<p class="font-medium">{item.title}</p>
							<p class="text-sm text-muted-foreground">{item.link}</p>
							<div class="mt-2 flex gap-2">
								<button class="rounded border px-3 py-1 text-sm" onclick={() => editProject(index)}>
									Edit
								</button>
								<button class="rounded border px-3 py-1 text-sm" onclick={() => removeProject(index)}>
									Delete
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if section === 'certificates'}
			<div class="mt-6 grid gap-6 lg:grid-cols-2">
				<form onsubmit={saveCertificate} class="space-y-3 rounded border p-4">
					<h2 class="text-lg font-medium">
						{certificateEditingIndex === null ? 'Add Certificate' : 'Edit Certificate'}
					</h2>
					<input
						class="w-full rounded border p-2"
						placeholder="Title"
						bind:value={certificateForm.title}
					/>
					<input
						class="w-full rounded border p-2"
						placeholder="Issuer"
						bind:value={certificateForm.issuer}
					/>
					<input class="w-full rounded border p-2" placeholder="Date" bind:value={certificateForm.date} />
					<input
						class="w-full rounded border p-2"
						placeholder="Image URL"
						bind:value={certificateForm.imageSrc}
					/>
					<input
						class="w-full rounded border p-2"
						placeholder="Certificate Link"
						bind:value={certificateForm.link}
					/>
					<textarea
						class="w-full rounded border p-2"
						placeholder="Description"
						rows="4"
						bind:value={certificateForm.description}
					></textarea>
					<div class="flex gap-2">
						<button class="rounded border px-4 py-2" type="submit">
							{certificateEditingIndex === null ? 'Add' : 'Update'}
						</button>
						{#if certificateEditingIndex !== null}
							<button class="rounded border px-4 py-2" type="button" onclick={resetCertificateForm}>
								Cancel
							</button>
						{/if}
					</div>
				</form>

				<div class="space-y-2 rounded border p-4">
					<h2 class="text-lg font-medium">Current Certificates</h2>
					{#each $certificatesStore as item, index (item.title + index)}
						<div class="rounded border p-3">
							<p class="font-medium">{item.title}</p>
							<p class="text-sm text-muted-foreground">{item.date}</p>
							<div class="mt-2 flex gap-2">
								<button class="rounded border px-3 py-1 text-sm" onclick={() => editCertificate(index)}>
									Edit
								</button>
								<button class="rounded border px-3 py-1 text-sm" onclick={() => removeCertificate(index)}>
									Delete
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if section === 'skills'}
			<div class="mt-6 grid gap-6 lg:grid-cols-2">
				<form onsubmit={saveSkill} class="space-y-3 rounded border p-4">
					<h2 class="text-lg font-medium">
						{skillEditingIndex === null ? 'Add Skill Category' : 'Edit Skill Category'}
					</h2>
					<input
						class="w-full rounded border p-2"
						placeholder="Category"
						bind:value={skillForm.category}
					/>
					<textarea
						class="w-full rounded border p-2"
						placeholder="Items (comma separated)"
						rows="4"
						bind:value={skillItemsInput}
					></textarea>
					<div class="flex gap-2">
						<button class="rounded border px-4 py-2" type="submit">
							{skillEditingIndex === null ? 'Add' : 'Update'}
						</button>
						{#if skillEditingIndex !== null}
							<button class="rounded border px-4 py-2" type="button" onclick={resetSkillForm}>
								Cancel
							</button>
						{/if}
					</div>
				</form>

				<div class="space-y-2 rounded border p-4">
					<h2 class="text-lg font-medium">Current Skill Categories</h2>
					{#each $skillsStore as item, index (item.category + index)}
						<div class="rounded border p-3">
							<p class="font-medium">{item.category}</p>
							<p class="text-sm text-muted-foreground">{item.items.join(', ')}</p>
							<div class="mt-2 flex gap-2">
								<button class="rounded border px-3 py-1 text-sm" onclick={() => editSkill(index)}>
									Edit
								</button>
								<button class="rounded border px-3 py-1 text-sm" onclick={() => removeSkill(index)}>
									Delete
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		{#if section === 'education'}
			<div class="mt-6 grid gap-6 lg:grid-cols-2">
				<form onsubmit={saveEducation} class="space-y-3 rounded border p-4">
					<h2 class="text-lg font-medium">
						{educationEditingIndex === null ? 'Add Education' : 'Edit Education'}
					</h2>
					<input class="w-full rounded border p-2" placeholder="Degree" bind:value={educationForm.degree} />
					<input
						class="w-full rounded border p-2"
						placeholder="Institution"
						bind:value={educationForm.institution}
					/>
					<input
						class="w-full rounded border p-2"
						placeholder="Location"
						bind:value={educationForm.location}
					/>
					<input
						class="w-full rounded border p-2"
						placeholder="Period (e.g. 2021 - 2023)"
						bind:value={educationForm.period}
					/>
					<textarea
						class="w-full rounded border p-2"
						placeholder="Description"
						rows="4"
						bind:value={educationForm.description}
					></textarea>
					<div class="flex gap-2">
						<button class="rounded border px-4 py-2" type="submit">
							{educationEditingIndex === null ? 'Add' : 'Update'}
						</button>
						{#if educationEditingIndex !== null}
							<button class="rounded border px-4 py-2" type="button" onclick={resetEducationForm}>
								Cancel
							</button>
						{/if}
					</div>
				</form>

				<div class="space-y-2 rounded border p-4">
					<h2 class="text-lg font-medium">Current Education Entries</h2>
					{#each $educationStore as item, index (item.degree + index)}
						<div class="rounded border p-3">
							<p class="font-medium">{item.degree}</p>
							<p class="text-sm text-muted-foreground">{item.institution}</p>
							<div class="mt-2 flex gap-2">
								<button class="rounded border px-3 py-1 text-sm" onclick={() => editEducation(index)}>
									Edit
								</button>
								<button class="rounded border px-3 py-1 text-sm" onclick={() => removeEducation(index)}>
									Delete
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>
