<script lang="ts">
	import { createClient } from "$lib/pocketbase";
	import { onMount } from "svelte";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import readStringArray from "$lib/content";
	interface SocialLink {
		id: string;
		name?: string;
		link?: string;
	}
	let socialForm = $state({
		id: "",
		name: "",
		link: ""
	});

	const resetSocialForm = () => {
		socialForm = { id: "", name: "", link: "" };
	};

	const editSocial = (item: SocialLink) => {
		socialForm = {
			id: item.id,
			name: item.name || "",
			link: item.link || ""
		};
	};
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<Card>
		<CardHeader>
			<CardTitle
				>{socialForm.id
					? "Edit Social Link"
					: "Add Social Link"}</CardTitle
			>
		</CardHeader>
		<CardContent>
			<input type="hidden" name="id" bind:value={socialForm.id} />
			<Input
				type="text"
				name="name"
				placeholder="Name (e.g. GitHub)"
				bind:value={socialForm.name}
				required
			/>
			<Input type="file" name="image" accept="image/*" />
			<Input
				type="url"
				name="link"
				placeholder="Profile Link"
				bind:value={socialForm.link}
			/>
			<div class="flex gap-2">
				<Button type="submit">{socialForm.id ? "Update" : "Add"}</Button
				>
				{#if socialForm.id}
					<Button
						type="button"
						variant="outline"
						on:click={resetSocialForm}
					>
						Cancel
					</Button>
				{/if}
			</div>
		</CardContent>
	</Card>
	<Card>
		<CardHeader>
			<CardTitle>Current Social Links</CardTitle>
		</CardHeader>
		<CardContent class="space-y-2">
			{#each socials as item (item.id)}
				<div class="rounded-lg border p-3">
					<p class="font-medium">{item.name}</p>
					<p class="text-muted-foreground text-sm">{item.link}</p>
					<div class="mt-2 flex gap-2">
						<Button
							variant="outline"
							size="sm"
							on:click={() => editSocial(item)}
						>
							Edit
						</Button>
						<input type="hidden" name="id" bind:value={item.id} />
						<Button
							variant="destructive"
							size="sm"
							on:click={() => deleteSocial(item.id)}
						>
							Delete
						</Button>
					</div>
				</div>
			{/each}
			{#if socials.length === 0}
				<p class="text-muted-foreground text-sm">
					No social links yet.
				</p>
			{/if}
		</CardContent>
	</Card>
</div>
