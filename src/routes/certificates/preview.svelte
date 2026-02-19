<script lang="ts">
	import CertificateCard from '$lib/components/normaluicomponents/certificateCard.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { certificatesStore } from '$lib/data/content-store';

	let loading = false;
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">CERTIFICATES</h1>

	{#if loading}
		<div class="mt-10">
			<Skeleton class="h-64 w-full" />
		</div>
	{/if}

	<div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each $certificatesStore.slice(0, 3) as cert (cert.title)}
			<CertificateCard
				link={cert.link}
				imageSrc={cert.imageSrc}
				description={cert.description}
				title={cert.title}
				date={cert.date}
			/>
		{/each}
	</div>

	{#if $certificatesStore.length > 3}
		<div class="mt-8 text-center">
			<a href="/certificates">
				<button
					class="rounded-md border border-primary px-4 py-2 text-sm font-medium transition-colors hover:bg-primary hover:text-primary-foreground"
					role="button_more_certificate"
				>
					See More
				</button>
			</a>
		</div>
	{/if}
	{#if $certificatesStore.length === 0 && !loading}
		<p class="mt-8 text-center text-sm text-muted-foreground">Add certificates to show them here.</p>
	{/if}
</section>
