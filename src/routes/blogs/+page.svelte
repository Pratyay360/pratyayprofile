<script lang="ts">
	import { onMount } from 'svelte';
	import BlogCard from '$lib/components/normaluicomponents/blogCard.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';

	const ENDPOINT = 'https://gql.hashnode.com';

	type PostNode = {
		url: string;
		coverImage: { url: string } | null;
		title: string;
		brief: string;
	};

	let posts: PostNode[] = [];
	let failed = false;
	let loading = true;

	onMount(async () => {
		const query = `
			query Publication {
				publication(host: "pratyaywrites.hashnode.dev") {
					posts(first: 50) {
						edges {
							node {
								coverImage { url }
								title
								brief
								url
							}
						}
					}
				}
			}
		`;

		try {
			const res = await fetch(ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query })
			});

			const json = await res.json();
			if (json.errors) throw json.errors;
			posts = json.data?.publication?.posts?.edges.map((e: { node: PostNode }) => e.node) ?? [];
		} catch (e) {
			console.error(e);
			failed = true;
		} finally {
			loading = false;
		}
	});
</script>

<main class="min-h-screen bg-background px-4 py-24">
	<h1 class="mb-16 text-center text-4xl font-bold tracking-wider md:text-5xl">
		Blogs by Pratyay Mitra Mustafi
	</h1>

	{#if failed}
		<div class="text-center text-destructive">
			<p class="text-xl">Couldn&apos;t fetch posts. Try again later.</p>
		</div>
	{/if}

	{#if loading && !failed}
		<div class="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each Array.from({ length: 6 }) as _, i (i)}
				<div class="space-y-3">
					<Skeleton class="h-56 w-full rounded-xl" />
					<Skeleton class="h-6 w-2/3" />
					<Skeleton class="h-4 w-full" />
					<Skeleton class="h-4 w-4/5" />
				</div>
			{/each}
		</div>
	{/if}

	{#if !loading && !failed && posts.length === 0}
		<p class="text-center text-sm text-muted-foreground">No posts yet.</p>
	{/if}

	{#if posts.length > 0}
		<section class="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each posts.filter((p) => p.coverImage?.url) as post (post.url)}
				<BlogCard
					link={post.url}
					imageUrl={post.coverImage?.url ?? ''}
					title={post.title}
					brief={post.brief}
				/>
			{/each}
		</section>
	{/if}
</main>
