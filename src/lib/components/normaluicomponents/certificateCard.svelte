<script lang="ts" module>
	// Typed shape for consumers who want to import the interface
	export interface Props {
		imageSrc?: string;
		title?: string;
		description?: string;
		link?: string;
		date?: string;
	}
</script>

<script lang="ts">
	import { Card, CardHeader, CardTitle, CardDescription } from '$lib/components/ui/card';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';
	import { Skeleton } from '$lib/components/ui/skeleton/index';
	let {
		imageSrc = '',
		title = '',
		description = '',
		link = '',
		date = ''
	}: Props = $props();
</script>

<a
	href={link}
	target="_blank"
	rel="noopener noreferrer"
	class="block"
	aria-label={title ? `Open certificate: ${title}` : 'Open certificate'}
>
	<Card class="group relative h-full overflow-hidden transition-transform hover:scale-105">
		<AspectRatio ratio={16 / 10}>
			{#if imageSrc}
				<enhanced:img
					src={imageSrc}
					alt={title || 'certificate image'}
					class="object-cover"
					sizes="(max-width: 768px) 100vw, 50vw"
				/>
			{:else}
				<Skeleton class="h-full w-full" />
			{/if}
		</AspectRatio>

		<CardHeader>
			<CardTitle class="line-clamp-2 text-lg">{title}</CardTitle>
			<CardDescription class="line-clamp-3">{description}</CardDescription>
			{#if date}
				<div class="text-muted-foreground mt-2 text-xs">{date}</div>
			{/if}
		</CardHeader>
	</Card>
</a>
