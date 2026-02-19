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
	let loading = true;

	onMount(async () => {
		const query = `
			query Publication {
				publication(host: "pratyaywrites.hashnode.dev") {
					posts(first: 4) {
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
			const response = await fetch(ENDPOINT, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query })
			});
			const result = await response.json();
			posts = result.data?.publication?.posts?.edges.map((e: { node: PostNode }) => e.node) ?? [];
		} catch (e) {
			console.error(e);
		} finally {
			loading = false;
		}
	});
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">BLOGS</h1>

	{#if loading}
		<div class="mt-10">
			<Skeleton class="h-64 w-full" />
		</div>
	{/if}

	<div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each posts.slice(0, 3) as post (post.url)}
			<BlogCard
				link={post.url}
				imageUrl={post.coverImage?.url ?? ''}
				title={post.title}
				brief={post.brief}
			/>
		{/each}
	</div>

	{#if posts.length > 3}
		<div class="mt-8 text-center">
			<a href="/blogs">
				<button class="rounded-md border border-primary px-4 py-2 text-sm font-medium hover:bg-primary hover:text-primary-foreground" role="button_more_blogs">
					See More
				</button>
			</a>
		</div>
	{/if}
	{#if posts.length === 0 && !loading}
		<p class="mt-8 text-center text-sm text-muted-foreground">No posts yet.</p>
	{/if}
</section>
