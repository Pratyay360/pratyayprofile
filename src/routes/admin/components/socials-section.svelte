<script lang="ts">
	import PocketBase from 'pocketbase';
	const pb = new PocketBase(import.meta.env.VITE_POCKET_BASE);
	interface SocialLink {
		name: string;
		image: string;
		link: string;
	}

	let socialLinks: SocialLink[] = [];
	let socialForm: SocialLink = {
		name: '',
		image: '',
		link: ''
	};
	let socialEditingIndex: number | null = null;

	function resetSocialForm(): void {
		socialForm = { name: '', image: '', link: '' };
		socialEditingIndex = null;
	}

	function saveSocial(event: SubmitEvent): void {
		event.preventDefault();
		if (!socialForm.name.trim()) {
			return;
		}

		if (socialEditingIndex === null) {
			socialLinks = [...socialLinks, { ...socialForm }];
		} else {
			socialLinks[socialEditingIndex] = { ...socialForm };
			socialLinks = [...socialLinks];
		}
		resetSocialForm();
	}

	function editSocial(index: number): void {
		socialForm = { ...socialLinks[index] };
		socialEditingIndex = index;
	}

	function removeSocial(index: number): void {
		socialLinks = socialLinks.filter((_, i) => i !== index);
		if (socialEditingIndex === index) {
			resetSocialForm();
		}
	}
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<form onsubmit={saveSocial} class="space-y-3 rounded border p-4">
		<h2 class="text-lg font-medium">
			{socialEditingIndex === null ? 'Add Social Link' : 'Edit Social Link'}
		</h2>
		<input
			class="w-full rounded border p-2"
			placeholder="Name (e.g. GitHub)"
			bind:value={socialForm.name}
		/>
		<input
			class="w-full rounded border p-2"
			placeholder="Icon/Image URL"
			bind:value={socialForm.image}
		/>
		<input
			class="w-full rounded border p-2"
			placeholder="Profile Link"
			bind:value={socialForm.link}
		/>
		<div class="flex gap-2">
			<button class="rounded border px-4 py-2" type="submit">
				{socialEditingIndex === null ? 'Add' : 'Update'}
			</button>
			{#if socialEditingIndex !== null}
				<button class="rounded border px-4 py-2" type="button" onclick={resetSocialForm}>
					Cancel
				</button>
			{/if}
		</div>
	</form>

	<div class="space-y-2 rounded border p-4">
		<h2 class="text-lg font-medium">Current Social Links</h2>
		{#each socialLinks as item, index (item.name + index)}
			<div class="rounded border p-3">
				<p class="font-medium">{item.name}</p>
				<p class="text-muted-foreground text-sm">{item.link}</p>
				<div class="mt-2 flex gap-2">
					<button class="rounded border px-3 py-1 text-sm" onclick={() => editSocial(index)}>
						Edit
					</button>
					<button class="rounded border px-3 py-1 text-sm" onclick={() => removeSocial(index)}>
						Delete
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>
