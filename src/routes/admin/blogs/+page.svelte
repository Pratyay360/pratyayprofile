<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type { PageData } from './$types';
	
	type BlogItem = {
		id: string;
		title?: string;
		content?: string;
		brief?: string;
		author?: string;
	};

	let { data }: { data: PageData } = $props();

	const blogs = $derived(data.blogs as BlogItem[]);
	let blogForm = $state<{
		id: string;
		title: string;
		content: string;
		author: string;
	}>({
		id: '',
		title: '',
		content: '',
		author: ''
	});
	
	const editBlog = (blog: BlogItem) => {
		blogForm = {
			id: blog.id,
			title: blog.title ?? '',
			content: blog.content ?? blog.brief ?? '',
			author: blog.author ?? ''
		};
	}

</script>

<div class="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
	<form
		method="POST"
		action="?/saveBlog"
		enctype="multipart/form-data" class="space-y-4 rounded border p-4"
	>
		<h2 class="text-lg font-medium">{blogForm.id ? 'Edit Blog Post' : 'Add Blog Post'}</h2>

		<input type="hidden" name="id" value={blogForm.id} />
		<input
			class="w-full rounded border p-2"
			name="title"
			placeholder="Title"
			bind:value={blogForm.title}
			required
		/>
		
		<input
			class="w-full rounded border p-2"
			name="author"
			placeholder="Blog author"
			bind:value={blogForm.author}
		/>
		<input class="w-full rounded border p-2" name="coverImage" type="file" accept="image/*" />

		<textarea
			class="h-64 w-full rounded border p-2"
			name="content"
			placeholder="blog content here ..."
			bind:value={blogForm.content}
		></textarea>



		<button class="rounded border px-3 py-1 text-sm" type="submit">Save</button> 
		<button class="rounded border px-3 py-1 text-sm" type="button" onclick={() => editBlog({})}>Cancel</button>
	</form>

	<div class="space-y-2 rounded border p-4">
		<h2 class="text-lg font-medium">Current Blog Posts</h2>
		{#each blogs as item (item.id)}
			<div class="rounded border p-3">
				<p class="font-medium">{item.title}</p>
				<p class="text-muted-foreground mt-1 line-clamp-2 text-sm">{item.content ?? item.brief}</p>
				<p class="text-muted-foreground truncate text-sm">{item.author}</p>
				<div class="mt-2 flex gap-2">
					<button class="rounded border px-3 py-1 text-sm" type="button" onclick={() => editBlog(item)}
						>Edit</button
					>
					<form method="POST" action="?/deleteBlog" enctype="multipart/form-data">
						<input type="hidden" name="id" value={item.id} />
						<button class="rounded border px-3 py-1 text-sm red-500" type="submit">Delete</button>
					</form>
				</div>
			</div>
		{/each}
		{#if blogs.length === 0}
			<p class="text-muted-foreground text-sm">No blog posts yet.</p>
		{/if}
	</div>
</div>
