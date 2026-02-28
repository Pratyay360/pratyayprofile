<script lang="ts">
	import ProjectCard from '$lib/components/normaluicomponents/projectCard.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import PocketBase from 'pocketbase';
	const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
	let loading = false;
</script>

<main class="bg-background min-h-screen px-4 py-24">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em] lg:text-5xl">
		Projects By {$photo.name}
	</h1>

	{#if loading}
		<div class="mt-10">
			<Skeleton class="h-64 w-full" />
		</div>
	{/if}

	<section class="mx-auto mt-12 max-w-6xl">
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each $projects as project (project.title)}
				<ProjectCard
					imageUrl={project.imageUrl}
					title={project.title}
					brief={project.brief}
					link={project.link}
				/>
			{/each}
		</div>
		{#if $projects.length === 0 && !loading}
			<p class="text-muted-foreground mt-8 text-center text-sm">
				Add your projects to display them here.
			</p>
		{/if}
	</section>
</main>
