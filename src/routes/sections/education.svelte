<script lang="ts">
	import { onMount } from 'svelte';
	import EducationCard from '$lib/components/normaluicomponents/education.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import PocketBase from 'pocketbase';
	const pb = new PocketBase(import.meta.env.VITE_POCKET_BASE!);

	let education = {} ;
	onMount(async () => {
		try{
			education = pb.collection('education').getFullList({});


		}
		catch(e){
			console.log(e)
			
		}
	})
	
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">EDUCATION</h1>
	<div class="mt-10 space-y-6">
	
		{#each education.items as edu (edu.id)}
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
