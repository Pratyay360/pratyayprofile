<script lang="ts">
	import {createClient} from '$lib/pocketbase';
	const pb = createClient(import.meta.env.VITE_POCKET_BASE!);
	import {onMount} from 'svelte';
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

	function resetSocialForm(): void {
		socialForm = { id: '', name: '', link: '' };
	}

	function editSocial(item: SocialLink): void {
		socialForm = {
			id: item.id,
			name: item.name ?? '',
			link: item.link ?? ''
		};
	}
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<form method="POST" action="?/saveSocial" enctype="multipart/form-data" class="space-y-3 rounded border p-4">
		<h2 class="text-lg font-medium">{socialForm.id ? 'Edit Social Link' : 'Add Social Link'}</h2>
		<input type="hidden" name="id" value={socialForm.id} />
		<input class="w-full rounded border p-2" name="name" placeholder="Name (e.g. GitHub)" bind:value={socialForm.name} required />
		<input class="w-full rounded border p-2" name="image" type="file" accept="image/*" />
		<input class="w-full rounded border p-2" name="link" placeholder="Profile Link" bind:value={socialForm.link} />
		<div class="flex gap-2">
			<button class="rounded border px-4 py-2" type="submit">{socialForm.id ? 'Update' : 'Add'}</button>
			{#if socialForm.id}
				<button class="rounded border px-4 py-2" type="button" onclick={resetSocialForm}>Cancel</button>
			{/if}
		</div>
	</form>

	<div class="space-y-2 rounded border p-4">
		<h2 class="text-lg font-medium">Current Social Links</h2>
		{#each socials as item (item.id)}
			<div class="rounded border p-3">
				<p class="font-medium">{item.name}</p>
				<p class="text-muted-foreground text-sm">{item.link}</p>
				<div class="mt-2 flex gap-2">
					<button class="rounded border px-3 py-1 text-sm" type="button" onclick={() => editSocial(item)}>Edit</button>
					<form method="POST" action="?/deleteSocial">
						<input type="hidden" name="id" value={item.id} />
						<button class="rounded border px-3 py-1 text-sm" type="submit">Delete</button>
					</form>
				</div>
			</div>
		{/each}
		{#if socials.length === 0}
			<p class="text-muted-foreground text-sm">No social links yet.</p>
		{/if}
	</div>
</div>
