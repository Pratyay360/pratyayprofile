<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	type BlogItem = {
		id: string;
		title?: string;
		content?: string;
		brief?: string;
		author?: string;
	};

	let { data }: { data: PageData } = $props();

	let blogForm = $state({
		id: '',
		title: '',
		content: '',
		author: ''
	});
	const blogs = $derived(data.blogs as BlogItem[]);

	const resetBlogForm = () => {
		blogForm = { id: '', title: '', content: '', author: '' };
	};

	const editBlog = (blog: BlogItem) => {
		blogForm = {
			id: blog.id,
			title: blog.title ?? '',
			content: blog.content ?? blog.brief ?? '',
			author: blog.author ?? ''
		};
	};
</script>

<div class="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
	<form method="POST" action="?/saveBlog" use:enhance class="space-y-4 rounded border p-4">
		<h2 class="text-lg font-medium">{blogForm.id ? 'Edit Blog Post' : 'Add Blog Post'}</h2>
		<Input type="hidden" name="id" value={blogForm.id} />
		<Input name="title" placeholder="Title" bind:value={blogForm.title} required />
		<Input name="author" placeholder="Blog author" bind:value={blogForm.author} />
		<Input name="coverImage" type="file" accept="image/*" />
		<Textarea name="content" rows={12} placeholder="Markdown content" bind:value={blogForm.content} />
		<div class="flex gap-2">
			<Button type="submit">Save</Button>
			{#if blogForm.id}
				<Button type="button" variant="outline" onclick={resetBlogForm}>Cancel</Button>
			{/if}
		</div>
	</form>

	<div class="space-y-2 rounded border p-4">
		<h2 class="text-lg font-medium">Current Blog Posts</h2>
		{#each blogs as item (item.id)}
			<div class="rounded border p-3">
				<p class="font-medium">{item.title}</p>
				<p class="text-muted-foreground mt-1 line-clamp-2 text-sm">{item.content ?? item.brief}</p>
				<p class="text-muted-foreground truncate text-sm">{item.author}</p>
				<div class="mt-2 flex gap-2">
					<Button type="button" variant="outline" size="sm" onclick={() => editBlog(item)}>
						Edit
					</Button>
					<form method="POST" action="?/deleteBlog" use:enhance>
						<Input type="hidden" name="id" value={item.id} />
						<Button type="submit" variant="destructive" size="sm">Delete</Button>
					</form>
				</div>
			</div>
		{/each}
		{#if blogs.length === 0}
			<p class="text-muted-foreground text-sm">No blog posts yet.</p>
		{/if}
	</div>
</div>
