<script lang="ts">
	import { onMount } from 'svelte';
	import CertificateCard from '$lib/components/normaluicomponents/certificateCard.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import PocketBase, { type RecordModel } from 'pocketbase';

	interface CertificateRecord {
		id: string;
		title: string;
		description: string;
		date: string;
		imageSrc: string;
		link: string;
	}

	const pb = new PocketBase(import.meta.env.VITE_POCKET_BASE);
	let loading = true;
	let failed = false;
	let certificates: CertificateRecord[] = [];

	function toMediaUrl(record: RecordModel, field: string): string {
		const value = record[field];
		if (typeof value !== 'string' || !value) return '';
		if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/')) {
			return value;
		}
		return pb.files.getURL(record, value);
	}

	onMount(async () => {
		try {
			const records = await pb.collection('certificates').getFullList<RecordModel>({});
			certificates = records.map((record) => ({
				id: record.id,
				title: typeof record.title === 'string' ? record.title : '',
				description: typeof record.description === 'string' ? record.description : '',
				date: typeof record.date === 'string' ? record.date : '',
				imageSrc: toMediaUrl(record, 'imageSrc'),
				link: typeof record.link === 'string' ? record.link : ''
			}));
		} catch (e) {
			console.error(e);
			failed = true;
		} finally {
			loading = false;
		}
	});
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
			<a href="/certificates">
				<button
					class="border-primary hover:bg-primary hover:text-primary-foreground rounded-md border px-4 py-2 text-sm font-medium transition-colors"
				>
					See More
				</button>
			</a>
		</div>
	{/if}
	{#if certificates.length === 0 && !loading && !failed}
		<p class="text-muted-foreground mt-8 text-center text-sm">Add certificates to show them here.</p>
	{/if}
</section>
