<script lang="ts">
	import EducationCard from '$lib/components/normaluicomponents/education.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import PocketBase from 'pocketbase';
	const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

	let loading = $state(false);
	let education = $state<PostNode[]>([]);
	let failed = $state(false);

	onMount(async () => {
		try {
			const res = await pb.collection('education').getFullList({ sort: '-created' });
			education = res;
		} catch (e) {
			console.error(e);
			failed = true;
		} finally {
			loading = false;
		}
	});
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">EDUCATION</h1>
	<div class="mt-10 space-y-6">
		{#if loading}
			<Skeleton class="h-32 w-full" />
		{/if}
		{#each education as edu (edu.degree)}
			<EducationCard
				title={edu.degree}
				category={edu.institution}
				date_from={edu.period.split(' - ')[0]}
				date_to={edu.period.split(' - ')[1]}
				description={edu.description}
			/>
		{/each}
		{#if education.length === 0 && !loading}
			<p class="text-muted-foreground text-center text-sm">Add your education details.</p>
		{/if}
	</div>
</section>
