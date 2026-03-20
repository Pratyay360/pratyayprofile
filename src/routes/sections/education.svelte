<script lang="ts">
	import EducationCard from '$lib/components/normaluicomponents/education.svelte';
	import { createClient } from '$lib/pocketbase';
	import { readString } from '$lib/content';
	import type { RecordModel } from 'pocketbase';

	interface EducationRecord {
		id: string;
		degree: string;
		category: string;
		date_from: string;
		date_to: string;
		description: string;
	}

	const pb = createClient(import.meta.env.VITE_POCKET_BASE!);
	let loading = true;
	let failed = false;
	let education: EducationRecord[] = [];
	try {
		const records = pb.collection('education').getFullList<RecordModel>({});
		education = records.map((record) => ({
			id: readString(record, 'id'),
			degree: readString(record, 'degree'),
			category: readString(record, 'category'),
			date_from: readString(record, 'date_from'),
			date_to: readString(record, 'date_to'),
			description: readString(record, 'description')
		}));
	} catch (e) {
		console.error(e);
		failed = true;
	} finally {
		loading = false;
	}
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">EDUCATION</h1>
	{#if failed}
		<p class="text-destructive mt-8 text-center text-sm">Unable to load education.</p>
	{/if}
	<div class="mt-10 space-y-6">
		{#each education as edu (edu.id)}
			<EducationCard
				title={edu.degree}
				category={edu.category}
				date_from={edu.date_from}
				date_to={edu.date_to}
				description={edu.description}
			/>
		{/each}
		{#if education.length === 0 && !loading && !failed}
			<p class="text-muted-foreground text-center text-sm">Add your education history to display it here.</p>
		{/if}
	</div>
</section>
