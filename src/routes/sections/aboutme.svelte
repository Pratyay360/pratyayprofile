<script lang="ts">
	import { onMount } from 'svelte';
	import PocketBase, { type RecordModel } from 'pocketbase';

	const pb = new PocketBase(import.meta.env.VITE_POCKET_BASE);
	let name = 'Pratyay Mustafi';
	let image = '/images/profile-placeholder.svg';
	let description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.';
	let titles: string[] = [];

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
			const records = await pb.collection('aboutme').getFullList<RecordModel>({});
			if (records.length > 0) {
				const first = records[0];
				name = typeof first.name === 'string' ? first.name : name;
				image = toMediaUrl(first, 'image') || image;
				description = typeof first.description === 'string' ? first.description : description;
				titles = records
					.map((record) => (typeof record.title === 'string' ? record.title : ''))
					.filter(Boolean);
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
