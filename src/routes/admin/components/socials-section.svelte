<script lang="ts">
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
			setStatus('Name is required.');
			return;
		}

		const next = [...$socialLinks];
		if (socialEditingIndex === null) {
			next.push({ ...socialForm });
			setStatus('Social link added.');
		} else {
			next[socialEditingIndex] = { ...socialForm };
			setStatus('Social link updated.');
		}
		setSocialLinks(next);
		resetSocialForm();
	}

	function editSocial(index: number): void {
		socialForm = { ...$socialLinks[index] };
		socialEditingIndex = index;
		setStatus('Editing social link.');
	}

	function removeSocial(index: number): void {
		setSocialLinks($socialLinks.filter((_, i) => i !== index));
		if (socialEditingIndex === index) {
			resetSocialForm();
		}
		setStatus('Social link removed.');
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
		{#each $socialLinks as item, index (item.name + index)}
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
