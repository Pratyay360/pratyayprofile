<script lang="ts">
	import { onMount } from 'svelte';
	import ProjectCard from '$lib/components/normaluicomponents/projectCard.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import {
		Card,
		CardContent,
		CardFooter,
		CardHeader
	} from '$lib/components/ui/card';
	import { createClient } from '$lib/pocketbase';
	import { readString, resolveMediaUrl } from '$lib/content';
	import type { RecordModel } from 'pocketbase';

	type ProjectRecord = {
		id: string;
		imageUrl: string;
		title: string;
		brief: string;
		link: string;
	};

	const pb = createClient(import.meta.env.VITE_POCKET_BASE);
	const profileName = 'Pratyay Mustafi';

	let loading = true;
	let failed = false;
	let projects: ProjectRecord[] = [];

	onMount(async () => {
		try {
			const results = await pb.collection('project').getFullList<RecordModel>({ sort: '-created' });
			projects = results.map((record) => ({
				id: record.id,
				imageUrl: resolveMediaUrl(pb, record, 'imageUrl', { token: null }),
				title: readString(record, 'title'),
				brief: readString(record, 'brief'),
				link: readString(record, 'link')
			}));
		} catch (error) {
			console.error('Failed to fetch projects:', error);
			failed = true;
		} finally {
			loading = false;
		}
	});
</script>

<main class="bg-background min-h-screen px-4 py-24">
	<div class="mx-auto max-w-6xl">
		<header class="space-y-4 text-center">
			<h1 class="text-3xl font-bold tracking-[0.2em] lg:text-5xl">Projects By {profileName}</h1>
			<p class="text-muted-foreground mx-auto max-w-2xl">
				A collection of my recent works and experimental builds.
			</p>
		</header>

		{#if loading}
			<div class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each Array.from({ length: 6 }, (_, i) => i) as i (i)}
					<Card class="overflow-hidden">
						<Skeleton class="h-40 w-full" />
						<CardHeader>
							<Skeleton class="h-5 w-3/4" />
							<Skeleton class="h-4 w-full" />
						</CardHeader>
						<CardContent>
							<Skeleton class="h-4 w-5/6" />
						</CardContent>
						<CardFooter>
							<Skeleton class="h-9 w-24" />
						</CardFooter>
					</Card>
				{/each}
			</div>
		{:else if failed}
			<div class="text-destructive mt-12 rounded-lg border border-current/20 px-4 py-3 text-sm">
				Failed to load projects. Please try again later.
			</div>
		{:else}
			<section class="mt-12">
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
			</section>
		{/if}
	</div>
</main>
