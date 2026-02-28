<script lang="ts">
	import { onMount } from 'svelte';
	import DonationCard from '$lib/components/normaluicomponents/donation.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import PocketBase from 'pocketbase';

	interface DonationRecord {
		id: string;
		name: string;
		image: string;
		link: string;
	}

	const pb = new PocketBase(import.meta.env.VITE_POCKET_BASE);

	let loading = true;
	let donations: DonationRecord[] = [];

	onMount(async () => {
		try {
			donations = await pb
				.collection('donations')
				.getFullList<DonationRecord>({ });
		} catch (error) {
			console.error(error);
		} finally {
			loading = false;
		}
	});
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">WANT TO SUPPORT MY WORK</h1>

	{#if loading}
		<div class="mt-8">
			<Skeleton class="h-64 w-full" />
		</div>
	{/if}

	<div class="mt-10 flex flex-wrap justify-center gap-6">
		{#each donations as donation (donation.id)}
			<div class="w-full md:w-1/3">
				<DonationCard name={donation.name} image={donation.image} link={donation.link} />
			</div>
		{/each}
		{#if donations.length === 0 && !loading}
			<p class="text-muted-foreground text-sm">Add donation links to display them here.</p>
		{/if}
	</div>
</section>
