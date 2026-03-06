<script lang="ts" context="module">
	// Typed shape for consumers who want to import the interface
	export interface Props {
		imageUrl?: string;
		title?: string;
		brief?: string;
		link?: string;
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
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';
	export let imageUrl: string = '';
	export let link: string = '';
	export let title: string = '';
	export let brief: string = '';
</script>

<a href={link} target="_blank" rel="noopener noreferrer" class="block">
	<Card class="group relative h-full overflow-hidden transition-transform hover:scale-105">
		<div class="relative">
			<AspectRatio ratio={16 / 9}>
				<enhanced:img
					src={imageUrl}
					alt={title}
					class="object-cover"
					sizes="(max-width: 768px) 100vw, 50vw"
				/>
			</AspectRatio>
		</div>
		<CardContent class="p-4">
			<CardHeader>
				<CardTitle class="line-clamp-2 text-lg">{title}</CardTitle>
				<CardDescription class="line-clamp-3">{brief}</CardDescription>
			</CardHeader>
		</CardContent>
	</Card>
</a>
