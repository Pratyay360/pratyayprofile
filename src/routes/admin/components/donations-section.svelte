<script lang="ts">
	interface Donation {
		id: string;
		name?: string;
		link?: string;
	}

	export let donations: Donation[] = [];

	let donationForm: {
		id: string;
		name: string;
		link: string;
	} = {
		id: '',
		name: '',
		link: ''
	};

	function resetDonationForm(): void {
		donationForm = { id: '', name: '', link: '' };
	}

	function editDonation(item: Donation): void {
		donationForm = {
			id: item.id,
			name: item.name ?? '',
			link: item.link ?? ''
		};
	}
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<form method="POST" action="?/saveDonation" enctype="multipart/form-data" class="space-y-3 rounded border p-4">
		<h2 class="text-lg font-medium">{donationForm.id ? 'Edit Donation Link' : 'Add Donation Link'}</h2>
		<input type="hidden" name="id" value={donationForm.id} />
		<input class="w-full rounded border p-2" name="name" placeholder="Name (e.g. Buy Me a Coffee)" bind:value={donationForm.name} required />
		<input class="w-full rounded border p-2" name="image" type="file" accept="image/*" />
		<input class="w-full rounded border p-2" name="link" placeholder="Donation Link" bind:value={donationForm.link} />
		<div class="flex gap-2">
			<button class="rounded border px-4 py-2" type="submit">{donationForm.id ? 'Update' : 'Add'}</button>
			{#if donationForm.id}
				<button class="rounded border px-4 py-2" type="button" onclick={resetDonationForm}>Cancel</button>
			{/if}
		</div>
	</form>

	<div class="space-y-2 rounded border p-4">
		<h2 class="text-lg font-medium">Current Donation Links</h2>
		{#each donations as item (item.id)}
			<div class="rounded border p-3">
				<p class="font-medium">{item.name}</p>
				<p class="text-muted-foreground text-sm">{item.link}</p>
				<div class="mt-2 flex gap-2">
					<button class="rounded border px-3 py-1 text-sm" type="button" onclick={() => editDonation(item)}>Edit</button>
					<form method="POST" action="?/deleteDonation">
						<input type="hidden" name="id" value={item.id} />
						<button class="rounded border px-3 py-1 text-sm" type="submit">Delete</button>
					</form>
				</div>
			</div>
		{/each}
		{#if donations.length === 0}
			<p class="text-muted-foreground text-sm">No donation links yet.</p>
		{/if}
	</div>
</div>
