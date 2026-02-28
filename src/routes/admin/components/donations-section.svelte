<script lang="ts">
	import { donationsStore, setDonations } from '$lib/data/content-store';
	import type { Donation } from '$lib/data/content-types';
	import { setStatus } from '../admin-store';

	let donationForm: Donation = {
		name: '',
		image: '',
		link: ''
	};
	let donationEditingIndex: number | null = null;

	function resetDonationForm(): void {
		donationForm = { name: '', image: '', link: '' };
		donationEditingIndex = null;
	}

	function saveDonation(event: SubmitEvent): void {
		event.preventDefault();
		if (!donationForm.name.trim()) {
			setStatus('Name is required.');
			return;
		}

		const next = [...$donationsStore];
		if (donationEditingIndex === null) {
			next.push({ ...donationForm });
			setStatus('Donation link added.');
		} else {
			next[donationEditingIndex] = { ...donationForm };
			setStatus('Donation link updated.');
		}
		setDonations(next);
		resetDonationForm();
	}

	function editDonation(index: number): void {
		donationForm = { ...$donationsStore[index] };
		donationEditingIndex = index;
		setStatus('Editing donation link.');
	}

	function removeDonation(index: number): void {
		setDonations($donationsStore.filter((_, i) => i !== index));
		if (donationEditingIndex === index) {
			resetDonationForm();
		}
		setStatus('Donation link removed.');
	}
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<form onsubmit={saveDonation} class="space-y-3 rounded border p-4">
		<h2 class="text-lg font-medium">
			{donationEditingIndex === null ? 'Add Donation Link' : 'Edit Donation Link'}
		</h2>
		<input
			class="w-full rounded border p-2"
			placeholder="Name (e.g. Buy Me a Coffee)"
			bind:value={donationForm.name}
		/>
		<input
			class="w-full rounded border p-2"
			placeholder="Icon/Image URL"
			bind:value={donationForm.image}
		/>
		<input
			class="w-full rounded border p-2"
			placeholder="Donation Link"
			bind:value={donationForm.link}
		/>
		<div class="flex gap-2">
			<button class="rounded border px-4 py-2" type="submit">
				{donationEditingIndex === null ? 'Add' : 'Update'}
			</button>
			{#if donationEditingIndex !== null}
				<button class="rounded border px-4 py-2" type="button" onclick={resetDonationForm}>
					Cancel
				</button>
			{/if}
		</div>
	</form>

	<div class="space-y-2 rounded border p-4">
		<h2 class="text-lg font-medium">Current Donation Links</h2>
		{#each $donationsStore as item, index (item.name + index)}
			<div class="rounded border p-3">
				<p class="font-medium">{item.name}</p>
				<p class="text-muted-foreground text-sm">{item.link}</p>
				<div class="mt-2 flex gap-2">
					<button class="rounded border px-3 py-1 text-sm" onclick={() => editDonation(index)}>
						Edit
					</button>
					<button class="rounded border px-3 py-1 text-sm" onclick={() => removeDonation(index)}>
						Delete
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>
