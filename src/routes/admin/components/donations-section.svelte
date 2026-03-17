<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";

	
	const resetDonationForm = () => {
		donationForm = { id: "", name: "", link: "" };
	};

	const editDonation = (item: Donation) => {
		donationForm = {
			id: item.id,
			name: item.name ?? "",
			link: item.link ?? "",
		};
	};
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<Card>
		<CardHeader>
			<CardTitle
				>{donationForm.id
					? "Edit Donation Link"
					: "Add Donation Link"}</CardTitle
			>
		</CardHeader>
		<CardContent>
			<form
				method="POST"
				action="?/saveDonation"
				enctype="multipart/form-data"
				class="space-y-3"
				use:enhance
			>
				<input type="hidden" name="id" value={donationForm.id} />
				<Input
					type="text"
					name="name"
					placeholder="Name (e.g. Buy Me a Coffee)"
					bind:value={donationForm.name}
					required
				/>
				<Input type="file" name="image" accept="image/*" />
				<Input
					type="url"
					name="link"
					placeholder="Donation Link"
					bind:value={donationForm.link}
				/>
				<div class="flex gap-2">
					<Button type="submit"
						>{donationForm.id ? "Update" : "Add"}</Button
					>
					{#if donationForm.id}
						<Button
							type="button"
							variant="outline"
							on:click={resetDonationForm}
						>
							Cancel
						</Button>
					{/if}
				</div>
			</form>
		</CardContent>
	</Card>

	<!-- Current Donations Card -->
	<Card>
		<CardHeader>
			<CardTitle>Current Donation Links</CardTitle>
		</CardHeader>
		<CardContent class="space-y-2">
			{#each donations as item (item.id)}
				<div class="rounded-lg border p-3">
					<p class="font-medium">{item.name}</p>
					<p class="text-muted-foreground text-sm">{item.link}</p>
					<div class="mt-2 flex gap-2">
						<Button
							variant="outline"
							size="sm"
							on:click={() => editDonation(item)}
						>
							Edit
						</Button>
						<form
							method="POST"
							action="?/deleteDonation"
							use:enhance
						>
							<input type="hidden" name="id" value={item.id} />
							<Button
								variant="destructive"
								size="sm"
								type="submit"
							>
								Delete
							</Button>
						</form>
					</div>
				</div>
			{/each}
			{#if donations.length === 0}
				<p class="text-muted-foreground text-sm">
					No donation links yet.
				</p>
			{/if}
		</CardContent>
	</Card>
</div>
