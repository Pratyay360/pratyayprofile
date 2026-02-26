<script lang="ts">
	import { educationStore, setEducation } from '$lib/data/content-store';
	import type { EducationEntry } from '$lib/data/content-types';
	import { setStatus } from '../admin-store';

	let educationForm: EducationEntry = {
		degree: '',
		institution: '',
		location: '',
		period: '',
		description: ''
	};
	let educationEditingIndex: number | null = null;

	function resetEducationForm(): void {
		educationForm = { degree: '', institution: '', location: '', period: '', description: '' };
		educationEditingIndex = null;
	}

	function saveEducation(event: SubmitEvent): void {
		event.preventDefault();
		if (!educationForm.degree.trim()) {
			setStatus('Degree is required.');
			return;
		}

		const next = [...$educationStore];
		if (educationEditingIndex === null) {
			next.push({ ...educationForm });
			setStatus('Education entry added.');
		} else {
			next[educationEditingIndex] = { ...educationForm };
			setStatus('Education entry updated.');
		}
		setEducation(next);
		resetEducationForm();
	}

	function editEducation(index: number): void {
		educationForm = { ...$educationStore[index] };
		educationEditingIndex = index;
		setStatus('Editing education entry.');
	}

	function removeEducation(index: number): void {
		setEducation($educationStore.filter((_, i) => i !== index));
		if (educationEditingIndex === index) {
			resetEducationForm();
		}
		setStatus('Education entry removed.');
	}
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<form onsubmit={saveEducation} class="space-y-3 rounded border p-4">
		<h2 class="text-lg font-medium">
			{educationEditingIndex === null ? 'Add Education' : 'Edit Education'}
		</h2>
		<input
			class="w-full rounded border p-2 "
			placeholder="Degree"
			bind:value={educationForm.degree}
		/>
		<input
			class="w-full rounded border p-2 "
			placeholder="Institution"
			bind:value={educationForm.institution}
		/>
		<input
			class="w-full rounded border p-2 "
			placeholder="Location"
			bind:value={educationForm.location}
		/>
		<input
			class="w-full rounded border p-2 "
			placeholder="Period (e.g. 2021 - 2023)"
			bind:value={educationForm.period}
		/>
		<textarea
			class="w-full rounded border p-2 "
			placeholder="Description"
			rows="4"
			bind:value={educationForm.description}
		></textarea>
		<div class="flex gap-2">
			<button class="rounded border px-4 py-2" type="submit">
				{educationEditingIndex === null ? 'Add' : 'Update'}
			</button>
			{#if educationEditingIndex !== null}
				<button class="rounded border px-4 py-2" type="button" onclick={resetEducationForm}>
					Cancel
				</button>
			{/if}
		</div>
	</form>

	<div class="space-y-2 rounded border p-4">
		<h2 class="text-lg font-medium">Current Education Entries</h2>
		{#each $educationStore as item, index (item.degree + index)}
			<div class="rounded border p-3">
				<p class="font-medium">{item.degree}</p>
				<p class="text-muted-foreground text-sm">{item.institution}</p>
				<div class="mt-2 flex gap-2">
					<button class="rounded border px-3 py-1 text-sm" onclick={() => editEducation(index)}>
						Edit
					</button>
					<button class="rounded border px-3 py-1 text-sm" onclick={() => removeEducation(index)}>
						Delete
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>
