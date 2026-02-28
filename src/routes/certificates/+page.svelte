<script lang="ts">
	import { onMount } from 'svelte';
	import CertificateCard from '$lib/components/normaluicomponents/certificateCard.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import PocketBase from 'pocketbase';

	interface CertificateRecord {
		id: string;
		title: string;
		description: string;
		date: string;
		imageSrc: string;
		link: string;
	}

	const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);
	let loading = true;
	let certificates: CertificateRecord[] = [];

	onMount(async () => {
		try {
			certificates = await pb
				.collection('certificates')
				.getFullList<CertificateRecord>({ sort: '-created' });
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	});
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
			{#each certificates as cert (cert.id)}
				<CertificateCard
					link={cert.link}
					imageSrc={cert.imageSrc}
					description={cert.description}
					title={cert.title}
					date={cert.date}
				/>
			{/each}
		</div>
		{#if certificates.length === 0 && !loading}
			<p class="text-muted-foreground mt-8 text-center text-sm">
				Add your certificates to display them here.
			</p>
		{/if}
	</section>
</main>
