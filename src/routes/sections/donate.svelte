<script lang="ts">
	import DonationCard from '$lib/components/normaluicomponents/donation.svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';

	type Donation = {
		name: string;
		image: string;
		link: string;
	};

	let loading = false;
	const donations: Donation[] = [];
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">WANT TO SUPPORT MY WORK</h1>

	{#if loading}
		<div class="mt-8">
			<Skeleton class="h-64 w-full" />
		</div>
	{/if}

	<div class="mt-10 flex flex-wrap justify-center gap-6">
		{#each donations as donation (donation.name)}
			<div class="w-full md:w-1/3">
				<DonationCard name={donation.name} image={donation.image} link={donation.link} />
			</div>
		{/each}
		{#if donations.length === 0}
			<p class="text-sm text-muted-foreground">Add donation links to display them here.</p>
		{/if}
	</div>
</section>
