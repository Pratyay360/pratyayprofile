<script lang="ts">
	import { onMount } from 'svelte';
	import ProjectCard from '$lib/components/normaluicomponents/projectCard.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import PocketBase from 'pocketbase';

	interface ProjectRecord {
		id: string;
		imageUrl: string;
		title: string;
		brief: string;
		link: string;
	}

	interface ProfileRecord {
		id: string;
		name?: string;
	}

	const pb = new PocketBase(import.meta.env.VITE_POCKET_BASE);
	let loading = true;
	let projects: ProjectRecord[] = [];
	let profileName = 'Pratyay';

	onMount(async () => {
		try {	
			const [projectsResult, profileResult] = await Promise.all([
				pb.collection('projects').getFullList<ProjectRecord>({}),
				pb.collection('aboutme').getFirstListItem<ProfileRecord>('')
			]);
			projects = projectsResult;
			profileName = profileResult?.name ?? profileName;
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	});
</script>

<main class="bg-background min-h-screen px-4 py-24">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em] lg:text-5xl">
		Projects By {profileName}
	</h1>

	{#if loading}
		<div class="mt-10">
			<Skeleton class="h-64 w-full" />
		</div>
	{/if}

	<section class="mx-auto mt-12 max-w-6xl">
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each projects as project (project.id)}
				<ProjectCard
					imageUrl={project.imageUrl}
					title={project.title}
					brief={project.brief}
					link={project.link}
				/>
			{/each}
		</div>
		{#if projects.length === 0 && !loading}
			<p class="text-muted-foreground mt-8 text-center text-sm">
				Add your projects to display them here.
			</p>
		{/if}
	</section>
</main>
