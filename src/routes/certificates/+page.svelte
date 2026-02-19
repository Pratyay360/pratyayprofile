<script lang="ts">
	import CertificateCard from '$lib/components/normaluicomponents/certificateCard.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { certificatesStore } from '$lib/data/content-store';

	let loading = false;
</script>

<main class="min-h-screen px-4 py-24">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em] lg:text-5xl">Certificates</h1>

	{#if loading}
		<div class="mt-10">
			<Skeleton class="h-64 w-full" />
		</div>
	{/if}

	<section class="mx-auto mt-12 max-w-6xl">
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each $certificatesStore as cert (cert.title)}
				<CertificateCard
					link={cert.link}
					imageSrc={cert.imageSrc}
					description={cert.description}
					title={cert.title}
					date={cert.date}
				/>
			{/each}
		</div>
		{#if $certificatesStore.length === 0 && !loading}
			<p class="mt-8 text-center text-sm text-muted-foreground">Add your certificates to display them here.</p>
		{/if}
	</section>
</main>
