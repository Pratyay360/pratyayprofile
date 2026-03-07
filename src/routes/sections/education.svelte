<script lang="ts">
	import { onMount } from 'svelte';
	import EducationCard from '$lib/components/normaluicomponents/education.svelte';
	import { createClient } from '$lib/pocketbase';
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
	let education: EducationRecord[] = [];
	onMount(async () => {
		try {
			const records = await pb.collection('education').getFullList<RecordModel>({});
			education = records.map((record) => ({
				id: record.id,
				degree: typeof record.degree === 'string' ? record.degree : '',
				category: typeof record.category === 'string' ? record.category : '',
				date_from: typeof record.date_from === 'string' ? record.date_from : '',
				date_to: typeof record.date_to === 'string' ? record.date_to : '',
				description: typeof record.description === 'string' ? record.description : ''
			}));
		} catch (e) {
			console.log(e);
		}
	});
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">EDUCATION</h1>
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
	</div>
</section>
