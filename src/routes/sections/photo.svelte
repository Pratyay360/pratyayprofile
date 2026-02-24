<script lang="ts">
	import { photoStore } from '$lib/data/content-store';
</script>

<section class="container mx-auto px-6 py-12">
	<div class="flex flex-col items-center gap-6 text-center">
		<div class="bg-muted h-40 w-40 overflow-hidden rounded-full" aria-hidden="true">
			{#if $photoStore.imageUrl}
				<img src={$photoStore.imageUrl} alt={$photoStore.name} class="h-full w-full object-cover" />
			{/if}
		</div>
		<div>
			<h1 class="text-3xl font-bold tracking-tight">{$photoStore.name}</h1>
			<p class="text-muted-foreground mt-2 text-lg">{$photoStore.title}</p>
		</div>
	</div>
</section>
