<script lang="ts">
	import DonationCard from '$lib/components/normaluicomponents/donation.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { createClient } from '$lib/pocketbase';
	import { readString, resolveMediaUrl } from '$lib/content';
	import { type RecordModel } from 'pocketbase';

	interface DonationRecord {
		id: string;
		name: string;
		image: string;
		link: string;
	}

	const pb = createClient(import.meta.env.VITE_POCKET_BASE);

	let loading = $state(true);
	let failed = $state(false);
	let donations: DonationRecord[] = $state([]);

	try {
		const records = pb.collection('donation').getFullList<RecordModel>({});
		donations = records.map((record) => ({
			id: record.id,
			name: readString(record, 'name'),
			image: resolveMediaUrl(pb, record, 'image', {token: null}),
			link: readString(record, 'link')
		}));
	} catch (error) {
		console.error(error);
		failed = true;
	} finally {
		loading = false;
	}
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">WANT TO SUPPORT MY WORK</h1>

	{#if loading}
		<div class="mt-8">
			<Skeleton class="h-64 w-full" />
		</div>
	{/if}

	{#if failed}
		<p class="text-destructive mt-8 text-center text-sm">Unable to load donation links.</p>
	{/if}

	<div class="mt-10 flex flex-wrap justify-center gap-6">
		{#each donations as donation (donation.id)}
			<div class="w-full md:w-1/3">
				<DonationCard name={donation.name} image={donation.image} link={donation.link} />
			</div>
		{/each}
		{#if donations.length === 0 && !loading && !failed}
			<p class="text-muted-foreground text-sm">Add donation links to display them here.</p>
		{/if}
	</div>
</section>
