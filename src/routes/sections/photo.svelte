<script lang="ts">
	import { photoStore } from '$lib/data/content-store';
</script>

<section class="container mx-auto px-6 py-12">
	<div class="flex flex-col items-center gap-6 text-center">
		<div class="h-40 w-40 overflow-hidden rounded-full bg-muted" aria-hidden="true">
			{#if $photoStore.imageUrl}
				<img src={$photoStore.imageUrl} alt={$photoStore.name} class="h-full w-full object-cover" />
			{/if}
		</div>
		<div>
			<h1 class="text-3xl font-bold tracking-tight">{$photoStore.name}</h1>
			<p class="mt-2 text-lg text-muted-foreground">{$photoStore.title}</p>
		</div>
	</div>
</section>
