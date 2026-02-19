<script lang="ts">
	import ImageCard from '$lib/components/normaluicomponents/imageCard.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';

	type SocialLink = {
		name: string;
		image: string;
		link: string;
	};

	let loading = false;
	const socialLinks: SocialLink[] = [];
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">CONTACT ME</h1>

	{#if loading}
		<div class="mt-8">
			<Skeleton class="h-10 w-full" />
		</div>
	{/if}

	<div class="mt-10 flex flex-wrap items-center justify-center gap-4">
		{#each socialLinks as item (item.name)}
			<div class="rounded-lg bg-black/5 p-3 dark:bg-white/10">
				<ImageCard image={item.image} link={item.link} name={item.name} />
			</div>
		{/each}
		{#if socialLinks.length === 0}
			<p class="text-sm text-muted-foreground">Add your social links to show them here.</p>
		{/if}
	</div>

	<div class="mt-10 flex items-center justify-center">
		<a href="/message_me">
			<button
				class="rounded-full border border-indigo-600 px-6 py-2 text-2xl font-bold transition-colors hover:bg-indigo-600 hover:text-white"
			>
				Message Me
			</button>
		</a>
	</div>
</section>
