<script lang="ts">
	import { onMount } from 'svelte';
	import BlogCard from '$lib/components/normaluicomponents/blogCard.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { createClient } from '$lib/pocketbase';
	import { type RecordModel } from 'pocketbase';

	interface BlogRecord {
		id: string;
		url: string;
		title: string;
		brief: string;
		coverImage?: string;
	}

	interface ProfileRecord {
		name?: string;
	}

	const pb = createClient(import.meta.env.VITE_POCKET_BASE);
	let posts: BlogRecord[] = [];
	let failed = false;
	let loading = true;
	let profileName = 'Pratyay';

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
			const [postResult, profileResult] = await Promise.all([
				pb.collection('blogs').getFullList<RecordModel>({}),
				pb.collection('aboutme').getFirstListItem<ProfileRecord>('')
			]);
			posts = postResult.map((record) => ({
				id: record.id,
				url: typeof record.url === 'string' ? record.url : '',
				title: typeof record.title === 'string' ? record.title : '',
				brief: typeof record.brief === 'string' ? record.brief : '',
				coverImage: toMediaUrl(record, 'coverImage')
			}));
			profileName = profileResult?.name ?? profileName;
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
		Blogs by {profileName}
	</h1>

	{#if failed}
		<div class="text-destructive text-center">
			<p class="text-xl">Couldn&apos;t fetch posts. Try again later.</p>
		</div>
	{/if}

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

	{#if !loading && !failed && posts.length === 0}
		<p class="text-muted-foreground text-center text-sm">No posts yet.</p>
	{/if}

	{#if posts.length > 0}
		<section class="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each posts.filter((p) => p.coverImage) as post (post.id)}
				<BlogCard
					link={post.url}
					imageUrl={post.coverImage ?? ''}
					title={post.title}
					brief={post.brief}
				/>
			{/each}
		</section>
	{/if}
</main>
