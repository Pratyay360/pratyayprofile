<script lang="ts">
	import { onMount } from 'svelte';
	import BlogCard from '$lib/components/normaluicomponents/blogCard.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import PocketBase from 'pocketbase';

	interface BlogRecord {
		id: string;
		url: string;
		title: string;
		brief: string;
		coverImage?: { url?: string };
	}

	const pb = new PocketBase(import.meta.env.VITE_POCKET_BASE);
	let posts: BlogRecord[] = [];
	let loading = true;

	onMount(async () => {
		try {
			posts = await pb.collection('blogs').getFullList<BlogRecord>({ });
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	});
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">BLOGS</h1>


	<div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each posts.slice(0, 3) as post (post.id)}
			<BlogCard
				link={`/blogs/${post.id}`}
				imageUrl={post.coverImage?.url ?? ''}
				title={post.title}
				brief={post.brief}
			/>
		{/each}
	</div>

	{#if posts.length > 3}
		<div class="mt-8 text-center">
			<a href="/blogs">
				<button
					class="border-primary hover:bg-primary hover:text-primary-foreground rounded-md border px-4 py-2 text-sm font-medium"
				>
					See More
				</button>
			</a>
		</div>
	{/if}
	{#if posts.length === 0 && !loading}
		<p class="text-muted-foreground mt-8 text-center text-sm">No posts yet.</p>
	{/if}
</section>
