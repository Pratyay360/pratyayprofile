<script lang="ts">
	import { onMount } from 'svelte';
	import { createClient } from '$lib/pocketbase';
	import { readString, resolveMediaUrl } from '$lib/content';
	import { type RecordModel } from 'pocketbase';

	const pb = createClient(import.meta.env.VITE_POCKET_BASE);
	let name = 'Pratyay Mustafi';
	let image = '';
	let aboutme = ''; 	
	let titles: string[] = [];

	onMount(async () => {
		try {
			const records = await pb.collection('me').getFullList<RecordModel>({  });
			if (records.length > 0) {
				const first = records[0];
				image = resolveMediaUrl(pb, first, 'image') || image;
				aboutme = readString(first, 'aboutme') || aboutme;
				titles = records
					.map((record) => readString(record, 'flash'))
					.filter(Boolean);
			}
		} catch (error) {
			console.error(error);
		}
	});
</script>

<section class="container mx-auto px-6 py-12">
	<div class="text-muted-foreground mx-auto mt-8 max-w-3xl text-lg">
		<enhanced:img src={image} alt={name} />
		<h1 class="text-center text-3xl font-bold tracking-[0.2em]">{name}</h1>
		{#each titles as title (title)}
			<p
				class="animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-primary pr-5 text-5xl text-foreground font-bold text-center"
			>
				{title}
			</p>
		{/each}
		<p class=" text-center">{aboutme}</p>
	</div>
</section>
