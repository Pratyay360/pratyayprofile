<script lang="ts">
	import { onMount } from 'svelte';
	import ProjectCard from '$lib/components/normaluicomponents/projectCard.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import PocketBase, { type RecordModel } from 'pocketbase';

	interface ProjectRecord {
		id: string;
		imageUrl: string;
		title: string;
		brief: string;
		link: string;
	}

	const pb = new PocketBase(import.meta.env.VITE_POCKET_BASE);
	let loading = true;
	let projects: ProjectRecord[] = [];

	function toMediaUrl(record: RecordModel, field: string): string {
		const value = record[field];
		if (typeof value !== 'string' || !value) return '';
		if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) {
			return value;
		}
		return pb.files.getURL(record, value);
	}

	onMount(async () => {
		try {
			const records = await pb.collection('projects').getFullList<RecordModel>({});
			projects = records.map((record) => ({
				id: record.id,
				imageUrl: toMediaUrl(record, 'imageUrl'),
				title: typeof record.title === 'string' ? record.title : '',
				brief: typeof record.brief === 'string' ? record.brief : '',
				link: typeof record.link === 'string' ? record.link : ''
			}));
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	});
</script>

<div class="bg-background min-h-screen px-4 py-24">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">PROJECTS</h1>

	{#if loading}
		<div class="mt-10">
			<Skeleton class="h-64 w-full" />
		</div>
	{/if}

	<div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each projects.slice(0, 3) as project (project.id)}
			<ProjectCard
				imageUrl={project.imageUrl}
				title={project.title}
				brief={project.brief}
				link={project.link}
			/>
		{/each}
	</div>

	{#if projects.length > 3}
		<div class="mt-8 text-center">
			<a href="/projects">
				<button class="button-30">See More</button>
			</a>
		</div>
	{/if}
	{#if projects.length === 0 && !loading}
		<p class="text-muted-foreground mt-8 text-center text-sm">Add your projects to display them here.</p>
	{/if}
</div>
