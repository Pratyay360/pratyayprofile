<script lang="ts">
	import { enhanced } from '$lib/enhanced/enhanced';
	let name = 'Pratyay Mustafi';
	let image = 'https://img.placeholder.com/500*500';
	let description = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.';
	import PocketBase from 'pocketbase';
	const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
	let loading = $state(false);
	let failed = $state(false);
	let title = pb.records('aboutme').getOne();
</script>

<section class="container mx-auto px-6 py-12">
	<h2 class="text-center text-3xl font-bold tracking-[0.2em]">ABOUT ME</h2>
	<div class="text-muted-foreground mx-auto mt-8 max-w-3xl text-lg">
		<enhanced:img src={image} alt={name} />
		<h1 class="text-center text-3xl font-bold tracking-[0.2em]">{name}</h1>
		{#each title as item (item.id)}
			<p class="typewriter text-center">{item.title}</p>
		{/each}
		<p class="typewriter text-center">{description}</p>
	</div>
</section>
