<script lang="ts">
	import EducationCard from '$lib/components/normaluicomponents/education.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { educationStore } from '$lib/data/content-store';

	let loading = false;
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">EDUCATION</h1>
	<div class="mt-10 space-y-6">
		{#if loading}
			<Skeleton class="h-32 w-full" />
		{/if}
		{#each $educationStore as edu (edu.degree)}
			<EducationCard
				title={edu.degree}
				category={edu.institution}
				date_from={edu.period.split(' - ')[0]}
				date_to={edu.period.split(' - ')[1]}
				description={edu.description}
			/>
		{/each}
		{#if $educationStore.length === 0 && !loading}
			<p class="text-muted-foreground text-center text-sm">Add your education details.</p>
		{/if}
	</div>
</section>
