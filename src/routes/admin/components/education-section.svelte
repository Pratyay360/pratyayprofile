<script lang="ts">
	interface EducationEntry {
		id: string;
		degree?: string;
		institution?: string;
		period?: string;
		description?: string;
	}

	export let education: EducationEntry[] = [];

	let educationForm: {
		id: string;
		degree: string;
		institution: string;
		period: string;
		description: string;
	} = {
		id: '',
		degree: '',
		institution: '',
		period: '',
		description: ''
	};

	function resetEducationForm(): void {
		educationForm = { id: '', degree: '', institution: '', period: '', description: '' };
	}

	function editEducation(item: EducationEntry): void {
		educationForm = {
			id: item.id,
			degree: item.degree ?? '',
			institution: item.institution ?? '',
			period: item.period ?? '',
			description: item.description ?? ''
		};
	}
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<form method="POST" action="?/saveEducation" class="space-y-3 rounded border p-4">
		<h2 class="text-lg font-medium">{educationForm.id ? 'Edit Education' : 'Add Education'}</h2>
		<input type="hidden" name="id" value={educationForm.id} />
		<input class="w-full rounded border p-2" name="degree" placeholder="Degree" bind:value={educationForm.degree} required />
		<input class="w-full rounded border p-2" name="institution" placeholder="Institution" bind:value={educationForm.institution} />
		<input class="w-full rounded border p-2" name="period" placeholder="Period (e.g. 2021 - 2023)" bind:value={educationForm.period} />
		<textarea class="w-full rounded border p-2" name="description" placeholder="Description" rows="4" bind:value={educationForm.description}></textarea>
		<div class="flex gap-2">
			<button class="rounded border px-4 py-2" type="submit">{educationForm.id ? 'Update' : 'Add'}</button>
			{#if educationForm.id}
				<button class="rounded border px-4 py-2" type="button" onclick={resetEducationForm}>Cancel</button>
			{/if}
		</div>
	</form>

	<div class="space-y-2 rounded border p-4">
		<h2 class="text-lg font-medium">Current Education Entries</h2>
		{#each education as item (item.id)}
			<div class="rounded border p-3">
				<p class="font-medium">{item.degree}</p>
				<p class="text-muted-foreground text-sm">{item.institution}</p>
				<div class="mt-2 flex gap-2">
					<button class="rounded border px-3 py-1 text-sm" type="button" onclick={() => editEducation(item)}>Edit</button>
					<form method="POST" action="?/deleteEducation">
						<input type="hidden" name="id" value={item.id} />
						<button class="rounded border px-3 py-1 text-sm" type="submit">Delete</button>
					</form>
				</div>
			</div>
		{/each}
		{#if education.length === 0}
			<p class="text-muted-foreground text-sm">No education entries yet.</p>
		{/if}
	</div>
</div>
