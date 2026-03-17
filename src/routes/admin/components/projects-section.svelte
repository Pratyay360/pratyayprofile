<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Textarea } from "$lib/components/ui/textarea";
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	interface Project {
		id: string;
		title?: string;
		brief?: string;
		link?: string;
	}
	const resetProjectForm = () => {
		projectForm = { id: "", title: "", brief: "", link: "" };
	};

	const editProject = (project: Project) => {
		projectForm = {
			id: project.id,
			title: project.title ?? "",
			brief: project.brief ?? "",
			link: project.link ?? "",
		};
	};
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<Card>
		<CardHeader>
			<CardTitle
				>{projectForm.id ? "Edit Project" : "Add Project"}</CardTitle
			>
		</CardHeader>
		<CardContent>
			<form
				method="POST"
				action="?/saveProject"
				enctype="multipart/form-data"
				class="space-y-3"
				use:enhance
			>
				<Input type="hidden" name="id" value={projectForm.id} />
				<Input
					type="text"
					name="title"
					placeholder="Title"
					bind:value={projectForm.title}
					required
				/>
				<Input type="file" name="imageUrl" accept="image/*" />
				<Input
					type="url"
					name="link"
					placeholder="Project Link"
					bind:value={projectForm.link}
				/>
				<Textarea
					name="brief"
					placeholder="Brief"
					rows="4"
					bind:value={projectForm.brief}
				/>
				<div class="flex gap-2">
					<Button type="submit"
						>{projectForm.id ? "Update" : "Add"}</Button
					>
					{#if projectForm.id}
						<Button
							type="button"
							variant="outline"
							on:click={resetProjectForm}
						>
							Cancel
						</Button>
					{/if}
				</div>
			</form>
		</CardContent>
	</Card>

	<!-- Current Projects Card -->
	<Card>
		<CardHeader>
			<CardTitle>Current Projects</CardTitle>
		</CardHeader>
		<CardContent class="space-y-2">
			{#each projects as item (item.id)}
				<div class="rounded-lg border p-3">
					<p class="font-medium">{item.title}</p>
					<p class="text-muted-foreground text-sm">{item.link}</p>
					<div class="mt-2 flex gap-2">
						<Button
							variant="outline"
							size="sm"
							on:click={() => editProject(item)}
						>
							Edit
						</Button>
						<form method="POST" action="?/deleteProject">
							<input type="hidden" name="id" value={item.id} />
							<Button
								variant="destructive"
								size="sm"
								type="submit"
							>
								Delete
							</Button>
						</form>
					</div>
				</div>
			{/each}
			{#if projects.length === 0}
				<p class="text-muted-foreground text-sm">No projects yet.</p>
			{/if}
		</CardContent>
	</Card>
</div>
