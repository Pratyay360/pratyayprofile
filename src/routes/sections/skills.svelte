<script lang="ts">
	import { onMount } from 'svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { createClient } from '$lib/pocketbase';

	interface SkillRecord {
		id: string;
		category: string;
		items: string[];
	}

	const pb = createClient(import.meta.env.VITE_POCKET_BASE!);

	let loading = true;
	let skills: SkillRecord[] = [];
	let failed = false;

	onMount(async () => {
		try {
			const records = await pb.collection('skill').getFullList<Record<string, unknown>>({});
			skills = records.map((record) => {
				const rawItems = record.items;
				const items = Array.isArray(rawItems)
					? rawItems.filter((item): item is string => typeof item === 'string')
					: typeof rawItems === 'string'
						? rawItems
								.split(',')
								.map((item) => item.trim())
								.filter(Boolean)
						: [];
				return {
					id: typeof record.id === 'string' ? record.id : '',
					category: typeof record.category === 'string' ? record.category : '',
					items
				};
			});
		} catch (error) {
			console.error(error);
			failed = true;
		} finally {
			loading = false;
		}
	});
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]" aria-level="1">SKILLS</h1>

	{#if failed}
		<div class="mt-8 text-center text-red-500">
			<p>Unable to load skills at the moment. Please try again later.</p>
		</div>
	{/if}

	{#if loading && !failed}
		<div class="mt-8">
			<Skeleton class="h-10 w-full" />
		</div>
	{/if}

	<!-- {#if !loading && !failed} -->
		<div class="mt-10 space-y-8">
			{#each skills as skill (skill.id)}
				<div class="border-primary border-l-4 pl-4">
					<h2 class="mb-3 text-xl font-semibold">{skill.category}</h2>
					<div class="flex flex-wrap gap-2">
						{#each skill.items as item (item)}
							<span class="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
								{item}
							</span>
						{/each}
					</div>
				</div>
			{/each} 
			<!-- {#if skills.length >= 0} -->

			<!-- {/if} --> 

		</div>
	<!-- {/if} -->
</section>
