<script lang="ts">
	import PocketBase from 'pocketbase';
	const pb = new PocketBase(import.meta.env.VITE_POCKET_BASE);
	interface Donation {
		name: string;
		image: string;
		link: string;
	}
	const fileInput = document.getElementById('fileInput');
	let donations: Donation[] = [];
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
			return;
		}

		if (donationEditingIndex === null) {
			donations = [...donations, { ...donationForm }];
		} else {
			donations[donationEditingIndex] = { ...donationForm };
			donations = [...donations];
		}
		resetDonationForm();
	}

	function editDonation(index: number): void {
		donationForm = { ...donations[index] };
		donationEditingIndex = index;
	}

	function removeDonation(index: number): void {
		donations = donations.filter((_, i) => i !== index);
		if (donationEditingIndex === index) {
			resetDonationForm();
		}
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
			type="file"
			accept="image/*"	
			on:change={(e) => {
				const file = e.target.files?.[0];
				if (file) {
					imageSrc = file;
				}
			}}	
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
		{#each donations as item, index (item.name + index)}
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
