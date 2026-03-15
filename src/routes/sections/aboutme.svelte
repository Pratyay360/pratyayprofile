<script lang="ts">
	import { onMount } from 'svelte';
	import { createClient } from '$lib/pocketbase';
	import { readString, resolveMediaUrl } from '$lib/content';
	import { type RecordModel } from 'pocketbase';

	const pb = createClient(import.meta.env.VITE_POCKET_BASE);
	let name = 'Pratyay Mustafi';
	let image = '/images/profile-placeholder.svg';
	let description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.';
	let titles: string[] = [];

	onMount(async () => {
		try {
			const records = await pb.collection('me').getFullList<RecordModel>({  });
			if (records.length > 0) {
				const first = records[0];
				name = readString(first, 'name') || name;
				image = resolveMediaUrl(pb, first, 'image') || image;
				description = readString(first, 'description') || description;
				titles = records
					.map((record) => readString(record, 'title'))
					.filter(Boolean);
			}
		} catch (error) {
			console.error(error);
		}
	});
</script>

<section class="container mx-auto px-6 py-12">
	<div class="text-muted-foreground mx-auto mt-8 max-w-3xl text-lg">
		<img src={image} alt={name} />
		<h1 class="text-center text-3xl font-bold tracking-[0.2em]">{name}</h1>
		{#each titles as title (title)}
			<p class="typewriter text-center">{title}</p>
		{/each}
		<p class="typewriter text-center">{description}</p>
	</div>
</section>
