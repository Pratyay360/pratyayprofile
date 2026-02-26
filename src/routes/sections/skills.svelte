<script lang="ts">
	import { skillsStore } from '$lib/data/content-store';
	import { Skeleton } from '$lib/components/ui/skeleton';

	let loading = false;
	let error = false;
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]" aria-level="1">SKILLS</h1>

	{#if error}
		<div class="mt-8 text-center text-red-500">
			<p>Unable to load skills at the moment. Please try again later.</p>
		</div>
	{/if}

	{#if loading && !error}
		<div class="mt-8">
			<Skeleton class="h-10 w-full" />
		</div>
	{/if}

	{#if !loading && !error}
		<div class="mt-10 space-y-8">
			{#each $skillsStore as category (category.category)}
				<div class="border-primary border-l-4 pl-4">
					<h2 class="mb-3 text-xl font-semibold">{category.category}</h2>
					<div class="flex flex-wrap gap-2">
						{#each category.items as item (item)}
							<span class="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm">
								{item}
							</span>
						{/each}
					</div>
				</div>
			{/each}
			{#if $skillsStore.length === 0}
				<p class="text-muted-foreground text-sm">Add your skills to display them here.</p>
			{/if}
		</div>
	{/if}
</section>
