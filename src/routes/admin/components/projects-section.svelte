<script lang="ts">
	let projectForm: Project = {
		imageUrl: '',
		title: '',
		brief: '',
		link: ''
	};
	let projectEditingIndex: number | null = null;

	function resetProjectForm(): void {
		projectForm = { imageUrl: '', title: '', brief: '', link: '' };
		projectEditingIndex = null;
	}

	function saveProject(event: SubmitEvent): void {
		event.preventDefault();
		if (!projectForm.title.trim()) {
			return;
		}

		resetProjectForm();
	}

	function editProject(index: number): void {
		projectForm = { ...$projects[index] };
		projectEditingIndex = index;
	}

	function removeProject(index: number): void {
		if (projectEditingIndex === index) {
			resetProjectForm();
		}
	}
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<form onsubmit={saveProject} class="space-y-3 rounded border p-4">
		<h2 class="text-lg font-medium">
			{projectEditingIndex === null ? 'Add Project' : 'Edit Project'}
		</h2>
		<input class="w-full rounded border p-2" placeholder="Title" bind:value={projectForm.title} />
		<input
			class="w-full rounded border p-2"
			placeholder="Image URL"
			bind:value={projectForm.imageUrl}
		/>
		<input
			class="w-full rounded border p-2"
			placeholder="Project Link"
			bind:value={projectForm.link}
		/>
		<textarea
			class="w-full rounded border p-2"
			placeholder="Brief"
			rows="4"
			bind:value={projectForm.brief}
		></textarea>
		<div class="flex gap-2">
			<button class="rounded border px-4 py-2" type="submit">
				{projectEditingIndex === null ? 'Add' : 'Update'}
			</button>
			{#if projectEditingIndex !== null}
				<button class="rounded border px-4 py-2" type="button" onclick={resetProjectForm}>
					Cancel
				</button>
			{/if}
		</div>
	</form>

	<div class="space-y-2 rounded border p-4">
		<h2 class="text-lg font-medium">Current Projects</h2>
		{#each $projects as item, index (item.title + index)}
			<div class="rounded border p-3">
				<p class="font-medium">{item.title}</p>
				<p class="text-muted-foreground text-sm">{item.link}</p>
				<div class="mt-2 flex gap-2">
					<button class="rounded border px-3 py-1 text-sm" onclick={() => editProject(index)}>
						Edit
					</button>
					<button class="rounded border px-3 py-1 text-sm" onclick={() => removeProject(index)}>
						Delete
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>
