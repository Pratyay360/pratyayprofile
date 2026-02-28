<script lang="ts">
	interface SkillCategory {
		id: string;
		category?: string;
		items?: string[];
	}

	export let skills: SkillCategory[] = [];

	let skillForm: {
		id: string;
		category: string;
		items: string;
	} = {
		id: '',
		category: '',
		items: ''
	};

	function resetSkillForm(): void {
		skillForm = { id: '', category: '', items: '' };
	}

	function editSkill(skill: SkillCategory): void {
		skillForm = {
			id: skill.id,
			category: skill.category ?? '',
			items: (skill.items ?? []).join(', ')
		};
	}
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<form method="POST" action="?/saveSkill" class="space-y-3 rounded border p-4">
		<h2 class="text-lg font-medium">{skillForm.id ? 'Edit Skill Category' : 'Add Skill Category'}</h2>
		<input type="hidden" name="id" value={skillForm.id} />
		<input class="w-full rounded border p-2" name="category" placeholder="Category" bind:value={skillForm.category} required />
		<textarea class="w-full rounded border p-2" name="items" placeholder="Items (comma separated)" rows="4" bind:value={skillForm.items}></textarea>
		<div class="flex gap-2">
			<button class="rounded border px-4 py-2" type="submit">{skillForm.id ? 'Update' : 'Add'}</button>
			{#if skillForm.id}
				<button class="rounded border px-4 py-2" type="button" onclick={resetSkillForm}>Cancel</button>
			{/if}
		</div>
	</form>

	<div class="space-y-2 rounded border p-4">
		<h2 class="text-lg font-medium">Current Skill Categories</h2>
		{#each skills as item (item.id)}
			<div class="rounded border p-3">
				<p class="font-medium">{item.category}</p>
				<p class="text-muted-foreground text-sm">{(item.items ?? []).join(', ')}</p>
				<div class="mt-2 flex gap-2">
					<button class="rounded border px-3 py-1 text-sm" type="button" onclick={() => editSkill(item)}>Edit</button>
					<form method="POST" action="?/deleteSkill">
						<input type="hidden" name="id" value={item.id} />
						<button class="rounded border px-3 py-1 text-sm" type="submit">Delete</button>
					</form>
				</div>
			</div>
		{/each}
		{#if skills.length === 0}
			<p class="text-muted-foreground text-sm">No skill categories yet.</p>
		{/if}
	</div>
</div>
