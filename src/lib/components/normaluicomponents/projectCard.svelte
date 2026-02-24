<script context="module" lang="ts">
	// Typed shape for consumers who want to import the interface
	export interface Props {
		imageUrl?: string;
		link?: string;
		title?: string;
		brief?: string;
	}
</script>

<script lang="ts">
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
		CardDescription
	} from '$lib/components/ui/card';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio/index';
	import { Skeleton } from '$lib/components/ui/skeleton/index';

	// Individual Svelte props (use `export let` so parent can pass values)
	export let imageUrl: string = '';
	export let link: string = '';
	export let title: string = '';
	export let brief: string = '';
</script>

<div
	href={link}
	target="_blank"
	rel="noopener noreferrer"
	class="block"
	aria-label={title ? `Open project: ${title}` : 'Open project'}
>
	<Card class="group relative h-full overflow-hidden transition-transform hover:scale-105">
		<!-- cover image -->
		<div class="relative">
			<AspectRatio ratio={16 / 9}>
				{#if imageUrl}
					<enhanced:img
						src={imageUrl}
						alt={title || 'project image'}
						class="object-cover"
						sizes="(max-width: 768px) 100vw, 50vw"
					/>
				{:else}
					<Skeleton class="h-full w-full" />
				{/if}
			</AspectRatio>
		</div>

		<CardContent class="p-4">
			<CardHeader>
				<CardTitle class="line-clamp-2 text-lg">{title}</CardTitle>
				<CardDescription class="line-clamp-3">{brief}</CardDescription>
			</CardHeader>
		</CardContent>
	</Card>
</div>
