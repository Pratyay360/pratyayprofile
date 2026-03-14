<script lang="ts">
	import { onMount } from 'svelte';
	import BlogCard from '$lib/components/normaluicomponents/blogCard.svelte';
	import { createClient } from '$lib/pocketbase';
	import type { RecordModel } from 'pocketbase';

	const pb = createClient(import.meta.env.VITE_POCKET_BASE);
	pb.autoCancellation(false);

	let posts: RecordModel[] = [];
	let loading = true;

	function toMediaUrl(record: RecordModel, field: string): string {
		const value = record[field];
		if (typeof value !== 'string' || !value) return '';
		if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) {
			return value;
		}
		return pb.files.getURL(value, value.coverImage, { token: null });

	}

	onMount(async () => {
		try {
			posts = await pb.collection('blogs').getFullList<RecordModel>({});
			console.log('Loaded posts:', posts);
		} catch (error) {
			console.error('Error loading blogs:', error);
		} finally {
			loading = false;
		}
	});
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">BLOGS</h1>


	<div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each posts.slice(0, 3) as post (post.id)}
				{@const content = typeof post.content === "string" ? post.content : ""}
				{@const excerpt = content.substring(0, 120)}
				{@const coverImage = toMediaUrl(post, 'coverImage')}
				<BlogCard
					link={`/blogs/${post.id}`}
					imageUrl={coverImage}
					title={typeof post.title === 'string' ? post.title : ''}
					brief={excerpt}
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
