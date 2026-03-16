<script lang="ts">
	import { createClient } from '$lib/pocketbase';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	const pb = createClient(import.meta.env.VITE_POCKET_BASE!);

	interface SocialLink {
		id: string;
		name?: string;
		link?: string;
	}

	export let socials: SocialLink[] = [];

	onMount(async () => {
		const res = await pb.collection('social_links').getFullList({}, 100);
		socials = res.items;
	});

	let socialForm: {
		id: string;
		name: string;
		link: string;
	} = {
		id: '',
		name: '',
		link: ''
	};

	const resetSocialForm = () => {
		socialForm = { id: '', name: '', link: '' };
	};

	const editSocial = (item: SocialLink) => {
		socialForm = {
			id: item.id,
			name: item.name ?? '',
			link: item.link ?? ''
		};
	};
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<!-- Form Card -->
	<Card>
		<CardHeader>
			<CardTitle>{socialForm.id ? 'Edit Social Link' : 'Add Social Link'}</CardTitle>
		</CardHeader>
		<CardContent>
			<form method="POST" action="?/saveSocial" enctype="multipart/form-data" class="space-y-3">
				<input type="hidden" name="id" value={socialForm.id} />
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
					<Button type="submit">{socialForm.id ? 'Update' : 'Add'}</Button>
					{#if socialForm.id}
						<Button type="button" variant="outline" on:click={resetSocialForm}>
							Cancel
						</Button>
					{/if}
				</div>
			</form>
		</CardContent>
	</Card>

	<!-- Current Social Links Card -->
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
						<Button variant="outline" size="sm" on:click={() => editSocial(item)}>
							Edit
						</Button>
						<form method="POST" action="?/deleteSocial">
							<input type="hidden" name="id" value={item.id} />
							<Button variant="destructive" size="sm" type="submit">
								Delete
							</Button>
						</form>
					</div>
				</div>
			{/each}
			{#if socials.length === 0}
				<p class="text-muted-foreground text-sm">No social links yet.</p>
			{/if}
		</CardContent>
	</Card>
</div>