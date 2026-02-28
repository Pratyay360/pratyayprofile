<script lang="ts">
	import { onMount } from 'svelte';
	import ImageCard from '$lib/components/normaluicomponents/imageCard.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import PocketBase, { type RecordModel } from 'pocketbase';

	interface SocialRecord {
		id: string;
		name: string;
		image: string;
		link: string;
	}

	const pb = new PocketBase(import.meta.env.VITE_POCKET_BASE);
	let social: SocialRecord[] = [];
	let loading = false;
	let failed = false;

	function toMediaUrl(record: RecordModel, field: string): string {
		const value = record[field];
		if (typeof value !== 'string' || !value) return '';
		if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) {
			return value;
		}
		return pb.files.getURL(record, value);
	}

	async function loadSocial() {
		loading = true;
		try {
			const records = await pb.collection('social').getFullList<RecordModel>({});
			social = records.map((record) => ({
				id: record.id,
				name: typeof record.name === 'string' ? record.name : '',
				image: toMediaUrl(record, 'image'),
				link: typeof record.link === 'string' ? record.link : ''
			}));
		} catch (error) {
			console.error(error);
			failed = true;
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		loadSocial();
	});
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">CONTACT ME</h1>

	{#if failed}
		<div class="mt-8 text-center text-red-500">
			<p>Unable to load social links at the moment. Please try again later.</p>
		</div>
	{/if}

	{#if loading && !failed}
		<div class="mt-8">
			<Skeleton class="h-10 w-full" />
		</div>
	{/if}

	<div class="mt-10 flex flex-wrap items-center justify-center gap-4">
		{#each social as item (item.id)}
			<div class="rounded-lg bg-black/5 p-3 dark:bg-white/10">
				<ImageCard image={item.image} link={item.link} name={item.name} />
			</div>
		{/each}
		{#if social.length === 0 && !loading}
			<p class="text-muted-foreground text-sm">Add your social links to show them here.</p>
		{/if}
	</div>

	<div class="mt-10 flex items-center justify-center">
		<a href="/message_me">
			<button
				class="rounded-full border border-indigo-600 px-6 py-2 text-2xl font-bold transition-colors hover:bg-indigo-600 hover:text-white"
			>
				Message Me
			</button>
		</a>
	</div>
</section>
