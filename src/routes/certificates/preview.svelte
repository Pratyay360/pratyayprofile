<script lang="ts">
	import { onMount } from 'svelte';
	import CertificateCard from '$lib/components/normaluicomponents/certificateCard.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { createClient } from '$lib/pocketbase';
	import { readString, resolveMediaUrl } from '$lib/content';
	import { type RecordModel } from 'pocketbase';
	import { Button } from '$lib/components/ui/button';
    import { redirect } from '@sveltejs/kit';
	
	interface CertificateRecord {
		id: string;
		title: string;
		description: string;
		date: string;
		imageSrc: string;
		link: string;
	}

	const pb = createClient(import.meta.env.VITE_POCKET_BASE);
	let loading = $state(true);
	let failed = $state(false);
	let certificates: CertificateRecord[] = $state([]);

	try {
		const records = pb.collection('certificate').getFullList<RecordModel>({});
		certificates = records.map((record) => ({
			id: record.id,
			title: readString(record, 'title'),
			description: readString(record, 'description'),
			date: readString(record, 'date'),
			imageSrc: resolveMediaUrl(pb, record, 'imageSrc'),
			link: readString(record, 'link')
		}));
	} catch (e) {
		console.error(e);
		failed = true;
	} finally {
		loading = false;
	}
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">CERTIFICATES</h1>
	{#if loading}
		<div class="mt-10">
			<Skeleton class="h-64 w-full" />
		</div>
	{/if}
	{#if failed}
		<p class="text-destructive mt-8 text-center text-sm">Unable to load certificates.</p>
	{/if}
	<div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each certificates.slice(0, 3) as cert (cert.id)}
			<CertificateCard
				link={cert.link}
				imageSrc={cert.imageSrc}
				description={cert.description}
				title={cert.title}
				date={cert.date}
			/>
		{/each}
	</div>

	{#if certificates.length > 3}
		<div class="mt-8 text-center">
				<Button
					class="border-primary hover:bg-primary hover:text-primary-foreground rounded-md border px-4 py-2 text-sm font-medium transition-colors"
					onclick={() => redirect(302, '/certificates')}
				>
					See More
				</Button>
				
		</div>
	{/if}
	<!-- {#if certificates.length === 0 && !loading && !failed}
		<p class="text-muted-foreground mt-8 text-center text-sm">Add certificates to show them here.</p>
	{/if} -->
</section>
