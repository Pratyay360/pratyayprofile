<script lang="ts">
	import { onMount } from 'svelte';
	import PocketBase from 'pocketbase';

	interface AboutMeRecord {
		id: string;
		name?: string;
		image?: string;
		description?: string;
		title?: string;
	}

	const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
	let name = 'Pratyay Mustafi';
	let image = 'https://img.placeholder.com/500*500';
	let description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.';
	let titles: string[] = [];

	onMount(async () => {
		try {
			const records = await pb.collection('aboutme').getFullList<AboutMeRecord>({ sort: '-created' });
			if (records.length > 0) {
				const first = records[0];
				name = first.name ?? name;
				image = first.image ?? image;
				description = first.description ?? description;
				titles = records.map((record) => record.title).filter((title): title is string => Boolean(title));
			}
		} catch (error) {
			console.error(error);
		}
	});
</script>

<section class="container mx-auto px-6 py-12">
	<h2 class="text-center text-3xl font-bold tracking-[0.2em]">ABOUT ME</h2>
	<div class="text-muted-foreground mx-auto mt-8 max-w-3xl text-lg">
		<enhanced:img src={image} alt={name} />
		<h1 class="text-center text-3xl font-bold tracking-[0.2em]">{name}</h1>
		{#each titles as title (title)}
			<p class="typewriter text-center">{title}</p>
		{/each}
		<p class="typewriter text-center">{description}</p>
	</div>
</section>
