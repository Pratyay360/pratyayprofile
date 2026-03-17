<script lang="ts">
	import { onMount, tick } from "svelte";
	import type { PageData } from "./$types";

	type BlogItem = {
		id: string;
		title?: string;
		content?: string;
		brief?: string;
		author?: string;
	};

	const editBlog = ({ props }) => {
		blogForm = {
			id: props.blog.id,
			title: props.blog.title ?? "",
			content: props.blog.content ?? props.blog.brief ?? "",
			author: props.blog.author ?? "",
		};
	};
</script>

<div class="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
	<h2 class="text-lg font-medium">
		{blogForm.id ? "Edit Blog Post" : "Add Blog Post"}
	</h2>
	<Input type="hidden" name="id" bind:value={blogForm.id} />
	<Input
		class="w-full rounded border p-2"
		name="title"
		placeholder="Title"
		bind:value={blogForm.title}
		required
	/>

	<Input
		class="w-full rounded border p-2"
		name="author"
		placeholder="Blog author"
		bind:value={blogForm.author}
	/>
	<Input
		class="w-full rounded border p-2"
		name="coverImage"
		type="file"
		accept="image/*"
		bind:files={blogForm.coverImage}
	/>
	<Input
		class="h-64 w-full rounded border p-2"
		name="content"
		type="file"
		accept="markdown/*"
		bind:value={blogForm.content}
	/>
	<Button class="rounded border px-3 py-1 text-sm" on:click={() => saveBlog()}
		>Save</Button
	>
	<Button
		class="rounded border px-3 py-1 text-sm"
		on:click={() => editBlog({})}
	>
		Cancel
	</Button>
	<div class="space-y-2 rounded border p-4">
		<h2 class="text-lg font-medium">Current Blog Posts</h2>
		{#each blogs as item (item.id)}
			<div class="rounded border p-3">
				<p class="font-medium">{item.title}</p>
				<p class="text-muted-foreground mt-1 line-clamp-2 text-sm">
					{item.content ?? item.brief}
				</p>
				<p class="text-muted-foreground truncate text-sm">
					{item.author}
				</p>
				<div class="mt-2 flex gap-2">
					<Button
						class="rounded border px-3 py-1 text-sm"
						on:click={() => editBlog(item)}>Edit</Button
					>
					<input type="hidden" name="id" value={item.id} />
					<button
						class="rounded border px-3 py-1 text-sm red-500"
						on:click={() => deleteBlog}>Delete</button
					>
				</div>
			</div>
		{/each}
		{#if blogs.length === 0}
			<p class="text-muted-foreground text-sm">No blog posts yet.</p>
		{/if}
	</div>
</div>
