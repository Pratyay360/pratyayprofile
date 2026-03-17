<script lang="ts">
	import ProjectCard from '$lib/components/normaluicomponents/projectCard.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { readString, resolveMediaUrl } from '$lib/content';
	import { pb } from '$lib/pocketbase';
	import type { RecordModel } from 'pocketbase';

	type ProjectRecord = {
		id: string;
		imageUrl: string;
		title: string;
		brief: string;
		link: string;
	};

	let loading = $state(true);
	let failed = $state(false);
	const profileName = 'Pratyay Mustafi';
	let projects = $state<ProjectRecord[]>([]);

	$effect(() => {
		let cancelled = false;

		const fetchProjects = async () => {
			try {
				loading = true;
				failed = false;

				const results = await pb
					.collection('project')
					.getFullList<RecordModel>({ sort: '-created' });

				if (cancelled) return;

				projects = results.map((record) => ({
					id: readString(record, 'id'),
					imageUrl: resolveMediaUrl(pb, record, 'imageUrl', { token: null }),
					title: readString(record, 'title'),
					brief: readString(record, 'brief'),
					link: readString(record, 'link')
				}));
			} catch (error) {
				console.error('Failed to fetch projects:', error);
				if (!cancelled) failed = true;
			} finally {
				if (!cancelled) loading = false;
			}
		};

		fetchProjects();

		return () => {
			cancelled = true;
		};
	});
</script>

<main class="bg-background min-h-screen px-4 py-24">
	<div class="mx-auto max-w-6xl">
		<header class="text-center space-y-4">
			<h1 class="text-3xl font-bold tracking-[0.2em] lg:text-5xl">
				Projects By {profileName}
			</h1>
			<p class="text-muted-foreground mx-auto max-w-2xl">
				A collection of my recent works and experimental builds.
			</p>
		</header>

		{#if loading}
			<div class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each Array(6) as _}
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
			<Alert variant="destructive"> 
				<AlertDescription>Failed to load projects. Please try again later.</AlertDescription> 
			</Alert>
		{:else}
			<section class="mt-12">
				<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{#each projects as project (project.id)}
						<ProjectCard
							bind:id={project.id}
							bind:imageUrl={project.imageUrl}
							bind:title={project.title}
							bind:brief={project.brief}
							bind:link={project.link}
						/>
					{/each}
				</div>
			</section>
		{/if}
	</div>
</main>