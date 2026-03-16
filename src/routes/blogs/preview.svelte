<script lang="ts">
	import { onMount } from "svelte";
	import BlogCard from "$lib/components/normaluicomponents/blogCard.svelte";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { createClient } from "$lib/pocketbase";
	import { readString, readStringArray, resolveMediaUrl } from "$lib/content";
	import { type RecordModel } from "pocketbase";
	
	interface BlogRecord {
		id: string;
		coverImage: string;
		title: string;
		brief: string;
		author: string;
		updated: string;
		created: string;
		link: string;
	}

	const pb = createClient(import.meta.env.VITE_POCKET_BASE);
	let loading = true;
	let failed = false;
	let posts: BlogRecord[] = [];
	onMount(async () => {
		try {
			const records = await pb.collection('blogs').getFullList<RecordModel>({});
			posts = records.map((record) => ({
				id: record.id,
				title: readString(record, "title"),
				brief: readString(record, "content").replace(/#\s*<[^>]*>?/g, "").trim(),
				author: readString(record, "author"),
				updated: readString(record, "updated"),
				created: readString(record, "created"),
				coverImage: (() => {
					const arr = readStringArray(record, "coverImage");
					const filename = arr[0] ?? "";
					const rec = { ...record, coverImage: filename };
					return resolveMediaUrl(pb, rec as RecordModel, "coverImage", { token: null });
				})(),
				link: `/blogs/${record.id}`,
			}));
		} catch (e) {
			console.error(e);
			failed = true;
		} finally {
			loading = false;
		}
	});
</script>

<div class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">BLOGS</h1>

	{#if loading}
		<div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			<div class="mt-10">
				<Skeleton class="h-64 w-full" />
			</div>
		</div>
	{/if}

	{#if failed}
		<p class="text-destructive mt-8 text-center text-sm">
			Unable to load blogs.
		</p>
	{/if}

	<div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each posts.slice(0, 3) as post}
			<BlogCard
				link={post.link}
				coverImage={post.coverImage}
				title={post.title}
				author={post.author}
				updated={post.updated}
				created={post.created}
				brief={post.brief}
			/>
		{/each}
	</div>

	{#if posts.length > 3}
		<div class="mt-8 text-center">
			<a href="/blogs">
				<button
					class="border-primary hover:bg-primary hover:text-primary-foreground rounded-md border px-4 py-2 text-sm font-medium transition-colors"
				>
					See More
				</button>
			</a>
		</div>
	{/if}
	{#if posts.length === 0 && !loading && !failed}
		<p class="text-muted-foreground mt-8 text-center text-sm">
			Add blog posts to show them here.
		</p>
	{/if}
</div>
