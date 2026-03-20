<script lang="ts">
	import { onMount } from 'svelte';
	import { createClient } from '$lib/pocketbase';
	import { readString, resolveMediaUrl } from '$lib/content';
	import { type RecordModel } from 'pocketbase';

	const pb = createClient(import.meta.env.VITE_POCKET_BASE);
	let data: RecordModel[] = [];
	

	onMount(async () => {
		const records = await pb.readStringArray();
		if (records.length > 0) {
			data = records.map((record) => readString(record, 'flash'))
				.filter(Boolean);
		}
	});
</script>

<section class="container mx-auto px-6 py-12">
	<div class="text-muted-foreground mx-auto mt-8 max-w-3xl text-lg">
		{#each data as record}
			<p
				class="animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-primary pr-5 text-5xl text-foreground font-bold text-center"
			>
				{record}
			</p>
		{/each}
	</div>
</section>
