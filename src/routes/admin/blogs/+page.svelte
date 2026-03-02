<script lang="ts">
	import { tick } from 'svelte';
	import type { PageData } from './$types';

	type BlogItem = {
		id: string;
		title?: string;
		content?: string;
		brief?: string;
		url?: string;
	};

	let { data }: { data: PageData } = $props();

	const blogs = $derived(data.blogs as BlogItem[]);
	let blogForm = $state<{
		id: string;
		title: string;
		content: string;
		url: string;
	}>({
		id: '',
		title: '',
		content: '',
		url: ''
	});

	let activeTab = $state<'write' | 'preview'>('write');
	let previewHtml = $state('');
	let previewLoading = $state(false);
	let editor = $state<HTMLTextAreaElement | null>(null);
	let contentImageInput = $state<HTMLInputElement | null>(null);
	let previewTimeout = $state<ReturnType<typeof setTimeout> | null>(null);

	function resetBlogForm(): void {
		blogForm = { id: '', title: '', content: '', url: '' };
		activeTab = 'write';
	}

	function editBlog(blog: BlogItem): void {
		blogForm = {
			id: blog.id,
			title: blog.title ?? '',
			content: blog.content ?? blog.brief ?? '',
			url: blog.url ?? ''
		};
		activeTab = 'write';
	}

	function withSelection(transform: (selected: string) => string): void {
		if (!editor) return;
		const start = editor.selectionStart;
		const end = editor.selectionEnd;
		const before = blogForm.content.slice(0, start);
		const selected = blogForm.content.slice(start, end);
		const after = blogForm.content.slice(end);
		const replaced = transform(selected);

		blogForm = { ...blogForm, content: `${before}${replaced}${after}` };

		void tick().then(() => {
			if (!editor) return;
			const cursor = start + replaced.length;
			editor.focus();
			editor.setSelectionRange(cursor, cursor);
		});
	}

	function wrapSelection(prefix: string, suffix: string): void {
		withSelection((selected) => `${prefix}${selected || 'text'}${suffix}`);
	}

	function prefixLines(prefix: string): void {
		withSelection((selected) => {
			const target = selected || 'item';
			return target
				.split('\n')
				.map((line) => `${prefix}${line}`)
				.join('\n');
		});
	}

	function insertTemplate(template: string): void {
		withSelection((selected) => (selected ? `${selected}\n\n${template}` : template));
	}

	function pickContentImage(): void {
		contentImageInput?.click();
	}

	function sanitizeAltText(value: string): string {
		return value.replace(/[[\]]/g, '').trim() || 'image';
	}

	function handleContentImageChange(event: Event): void {
		const input = event.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
			const result = typeof reader.result === 'string' ? reader.result : '';
			if (!result) return;
			const alt = sanitizeAltText(file.name.replace(/\.[^/.]+$/, ''));
			insertTemplate(`![${alt}](${result})`);
		};
		reader.readAsDataURL(file);

		input.value = '';
	}

	function handleEditorKeydown(event: KeyboardEvent): void {
		if (!(event.ctrlKey || event.metaKey)) return;

		const key = event.key.toLowerCase();
		if (key === 'b') {
			event.preventDefault();
			wrapSelection('**', '**');
		} else if (key === 'i') {
			event.preventDefault();
			wrapSelection('*', '*');
		} else if (key === 'k') {
			event.preventDefault();
			wrapSelection('[', '](https://example.com)');
		}
	}

	async function refreshPreview(markdown: string): Promise<void> {
		if (typeof window === 'undefined') return;
		previewLoading = true;
		try {
			const response = await fetch('/admin/blogs/preview', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ markdown })
			});
			if (!response.ok) {
				previewHtml = '<p>Could not generate preview.</p>';
				return;
			}
			const payload = (await response.json()) as { html?: string };
			previewHtml = payload.html ?? '';
		} catch {
			previewHtml = '<p>Could not generate preview.</p>';
		} finally {
			previewLoading = false;
		}
	}

	$effect(() => {
		if (previewTimeout) clearTimeout(previewTimeout);
		previewTimeout = setTimeout(() => {
			void refreshPreview(blogForm.content);
		}, 220);
		return () => {
			if (previewTimeout) clearTimeout(previewTimeout);
		};
	});
</script>

<div class="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
	<form
		method="POST"
		action="?/saveBlog"
		enctype="multipart/form-data"
		class="space-y-4 rounded border p-4"
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
			name="url"
			placeholder="Blog URL"
			bind:value={blogForm.url}
		/>
		<input class="w-full rounded border p-2" name="coverImage" type="file" accept="image/*" />

		<div class="space-y-2">
			<div class="flex flex-wrap gap-2">
				<button class="rounded border px-2 py-1 text-xs" type="button" onclick={() => wrapSelection('**', '**')}
					>Bold</button
				>
				<button class="rounded border px-2 py-1 text-xs" type="button" onclick={() => wrapSelection('*', '*')}
					>Italic</button
				>
				<button class="rounded border px-2 py-1 text-xs" type="button" onclick={() => wrapSelection('`', '`')}
					>Code</button
				>
				<button class="rounded border px-2 py-1 text-xs" type="button" onclick={() => prefixLines('## ')}
					>H2</button
				>
				<button class="rounded border px-2 py-1 text-xs" type="button" onclick={() => prefixLines('- ')}
					>List</button
				>
				<button
					class="rounded border px-2 py-1 text-xs"
					type="button"
					onclick={() => insertTemplate('```ts\nconsole.log("hello");\n```')}>Code Block</button
				>
				<button
					class="rounded border px-2 py-1 text-xs"
					type="button"
					onclick={() => wrapSelection('[', '](https://example.com)')}>Link</button
				>
				<button
					class="rounded border px-2 py-1 text-xs"
					type="button"
					onclick={pickContentImage}>Image Upload</button
				>
			</div>
			<input
				name="contentImage"
				type="file"
				accept="image/*"
				class="hidden"
				bind:this={contentImageInput}
				onchange={handleContentImageChange}
			/>

			<div class="bg-muted flex items-center gap-2 rounded p-1 text-sm">
				<button
					class="rounded px-3 py-1 {activeTab === 'write' ? 'bg-background border' : ''}"
					type="button"
					onclick={() => (activeTab = 'write')}>Write</button
				>
				<button
					class="rounded px-3 py-1 {activeTab === 'preview' ? 'bg-background border' : ''}"
					type="button"
					onclick={() => (activeTab = 'preview')}>Preview</button
				>
				<p class="text-muted-foreground ml-auto text-xs">
					{blogForm.content.trim().split(/\s+/).filter(Boolean).length} words
				</p>
			</div>

			{#if activeTab === 'write'}
				<textarea
					class="min-h-[360px] w-full rounded border p-3 font-mono text-sm"
					name="content"
					placeholder="Write markdown here..."
					bind:value={blogForm.content}
					bind:this={editor}
					onkeydown={handleEditorKeydown}
				></textarea>
			{:else}
				<div class="prose prose-neutral dark:prose-invert min-h-[360px] max-w-none rounded border p-4">
					{#if previewLoading}
						<p class="text-muted-foreground text-sm">Rendering preview...</p>
					{:else}
						{@html previewHtml}
					{/if}
				</div>
			{/if}
		</div>

		<div class="flex gap-2">
			<button class="rounded border px-4 py-2" type="submit">{blogForm.id ? 'Update' : 'Add'}</button>
			{#if blogForm.id}
				<button class="rounded border px-4 py-2" type="button" onclick={resetBlogForm}>Cancel</button>
			{/if}
		</div>
	</form>

	<div class="space-y-2 rounded border p-4">
		<h2 class="text-lg font-medium">Current Blog Posts</h2>
		{#each blogs as item (item.id)}
			<div class="rounded border p-3">
				<p class="font-medium">{item.title}</p>
				<p class="text-muted-foreground mt-1 line-clamp-2 text-sm">{item.content ?? item.brief}</p>
				<p class="text-muted-foreground truncate text-sm">{item.url}</p>
				<div class="mt-2 flex gap-2">
					<button class="rounded border px-3 py-1 text-sm" type="button" onclick={() => editBlog(item)}
						>Edit</button
					>
					<form method="POST" action="?/deleteBlog">
						<input type="hidden" name="id" value={item.id} />
						<button class="rounded border px-3 py-1 text-sm" type="submit">Delete</button>
					</form>
				</div>
			</div>
		{/each}
		{#if blogs.length === 0}
			<p class="text-muted-foreground text-sm">No blog posts yet.</p>
		{/if}
	</div>
</div>
