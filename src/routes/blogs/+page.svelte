<script lang="ts">
		import { onMount } from "svelte";
	import BlogCard from "$lib/components/normaluicomponents/blogCard.svelte";
	import { Skeleton } from "$lib/components/ui/skeleton";
	import { createClient } from "$lib/pocketbase";
	import { readString, resolveMediaUrl } from "$lib/content";
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
				brief: readString(record, "content"),
				author: readString(record, "author"),
				updated: readString(record, "updated"),
				created: readString(record, "created"),
				coverImage: resolveMediaUrl(pb, record, "coverImage", { token: null }),
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

	{#if !loading && posts.length > 0}
		<section class="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each posts as post (post.id)}
				<BlogCard
					link={post.link}
					coverImage={post.coverImage}
					title={post.title}
					author={post.author}
					updated={post.updated}
					created={post.created}
					brief={post.content}
				/>
			{/each}
		</section>
	{/if}
</main>
