<script lang="ts">
	interface Project {
		id: string;
		title?: string;
		brief?: string;
		link?: string;
	}

	export let projects: Project[] = [];

	let projectForm: {
		id: string;
		title: string;
		brief: string;
		link: string;
	} = {
		id: '',
		title: '',
		brief: '',
		link: ''
	};

	function resetProjectForm(): void {
		projectForm = { id: '', title: '', brief: '', link: '' };
	}

	function editProject(project: Project): void {
		projectForm = {
			id: project.id,
			title: project.title ?? '',
			brief: project.brief ?? '',
			link: project.link ?? ''
		};
	}
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<form method="POST" action="?/saveProject" enctype="multipart/form-data" class="space-y-3 rounded border p-4">
		<h2 class="text-lg font-medium">{projectForm.id ? 'Edit Project' : 'Add Project'}</h2>
		<input type="hidden" name="id" value={projectForm.id} />
		<input class="w-full rounded border p-2" name="title" placeholder="Title" bind:value={projectForm.title} required />
		<input class="w-full rounded border p-2" name="imageUrl" type="file" accept="image/*" />
		<input class="w-full rounded border p-2" name="link" placeholder="Project Link" bind:value={projectForm.link} />
		<textarea class="w-full rounded border p-2" name="brief" placeholder="Brief" rows="4" bind:value={projectForm.brief}></textarea>
		<div class="flex gap-2">
			<button class="rounded border px-4 py-2" type="submit">{projectForm.id ? 'Update' : 'Add'}</button>
			{#if projectForm.id}
				<button class="rounded border px-4 py-2" type="button" onclick={resetProjectForm}>Cancel</button>
			{/if}
		</div>
	</form>

	<div class="space-y-2 rounded border p-4">
		<h2 class="text-lg font-medium">Current Projects</h2>
		{#each projects as item (item.id)}
			<div class="rounded border p-3">
				<p class="font-medium">{item.title}</p>
				<p class="text-muted-foreground text-sm">{item.link}</p>
				<div class="mt-2 flex gap-2">
					<button class="rounded border px-3 py-1 text-sm" type="button" onclick={() => editProject(item)}>Edit</button>
					<form method="POST" action="?/deleteProject">
						<input type="hidden" name="id" value={item.id} />
						<button class="rounded border px-3 py-1 text-sm" type="submit">Delete</button>
					</form>
				</div>
			</div>
		{/each}
		{#if projects.length === 0}
			<p class="text-muted-foreground text-sm">No projects yet.</p>
		{/if}
	</div>
</div>
