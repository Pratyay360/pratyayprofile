<script lang="ts">
	interface SkillCategory {
		category: string;
		items: string[];
	}

	let skills: SkillCategory[] = [];
	let skillForm: SkillCategory = {
		category: '',
		items: []
	};
	let skillItemsInput = '';
	let skillEditingIndex: number | null = null;

	function resetSkillForm(): void {
		skillForm = { category: '', items: [] };
		skillItemsInput = '';
		skillEditingIndex = null;
	}

	function saveSkill(event: SubmitEvent): void {
		event.preventDefault();
		if (!skillForm.category.trim()) {
			return;
		}

		const payload: SkillCategory = {
			category: skillForm.category,
			items: skillItemsInput
				.split(',')
				.map((item) => item.trim())
				.filter(Boolean)
		};

		if (skillEditingIndex === null) {
			skills = [...skills, payload];
		} else {
			skills[skillEditingIndex] = payload;
			skills = [...skills];
		}
		resetSkillForm();
	}

	function editSkill(index: number): void {
		skillForm = { ...skills[index] };
		skillItemsInput = skills[index].items.join(', ');
		skillEditingIndex = index;
	}

	function removeSkill(index: number): void {
		skills = skills.filter((_, i) => i !== index);
		if (skillEditingIndex === index) {
			resetSkillForm();
		}
	}
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<form onsubmit={saveSkill} class="space-y-3 rounded border p-4">
		<h2 class="text-lg font-medium">
			{skillEditingIndex === null ? 'Add Skill Category' : 'Edit Skill Category'}
		</h2>
		<input class="w-full rounded border p-2" placeholder="Category" bind:value={skillForm.category} />
		<textarea
			class="w-full rounded border p-2"
			placeholder="Items (comma separated)"
			rows="4"
			bind:value={skillItemsInput}
		></textarea>
		<div class="flex gap-2">
			<button class="rounded border px-4 py-2" type="submit">
				{skillEditingIndex === null ? 'Add' : 'Update'}
			</button>
			{#if skillEditingIndex !== null}
				<button class="rounded border px-4 py-2" type="button" onclick={resetSkillForm}>
					Cancel
				</button>
			{/if}
		</div>
	</form>

	<div class="space-y-2 rounded border p-4">
		<h2 class="text-lg font-medium">Current Skill Categories</h2>
		{#each skills as item, index (item.category + index)}
			<div class="rounded border p-3">
				<p class="font-medium">{item.category}</p>
				<p class="text-muted-foreground text-sm">{item.items.join(', ')}</p>
				<div class="mt-2 flex gap-2">
					<button class="rounded border px-3 py-1 text-sm" onclick={() => editSkill(index)}>
						Edit
					</button>
					<button class="rounded border px-3 py-1 text-sm" onclick={() => removeSkill(index)}>
						Delete
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>
