<script lang="ts">
	import BlogCard from '$lib/components/normaluicomponents/blogCard.svelte';
	import { createClient } from "$lib/pocketbase";
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import { onMount } from 'svelte';
	import type { RecordModel } from 'pocketbase';

	const pb = createClient(import.meta.env.VITE_POCKET_BASE!);
	pb.autoCancellation(false);

	let blogList: RecordModel[] = [];
	let loading = true;
	let failed = false;

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
			blogList = await pb.collection("blogs").getFullList<RecordModel>({});
		} catch {
			failed = true;
		} finally {
			loading = false;
		}
	});
</script>

<main class="bg-background min-h-screen px-4 py-24">
	<h1 class="mb-16 text-center text-4xl font-bold tracking-wider md:text-5xl">
		Blogs.
	</h1>

	{#if loading && !failed}
		<div class="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each Array.from({ length: 6 }, (_, i) => i) as i (i)}
				<div class="space-y-3">
					<Skeleton class="h-56 w-full rounded-xl" />
					<Skeleton class="h-6 w-2/3" />
					<Skeleton class="h-4 w-full" />
					<Skeleton class="h-4 w-4/5" />
				</div>
			{/each}
		</div>
	{/if}

	{#if !loading && blogList.length > 0}
		<section class="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each blogList as post (post.id)}
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
		</section>
	{/if}
</main>
