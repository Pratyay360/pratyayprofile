<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const blog = $derived(data.blog);
	const renderedContent = $derived(data.renderedContent);
</script>

<article class="mx-auto w-full max-w-4xl px-4 py-16">
	<h1 class="mb-4 text-4xl font-bold tracking-tight">{blog.title}</h1>
	<p class="text-muted-foreground mb-10 text-sm">
		Created on: {blog.created} Last updated: {blog.updated} by {blog.author}
	</p>
	<div class="prose prose-neutral dark:prose-invert max-w-none">{@html renderedContent}</div>
</article>
