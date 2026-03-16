<script lang="ts">
    import type { PageData } from "./$types";
    import markdownit from "markdown-it";
    const md = markdownit();
    let { data }: { data: PageData } = $props();
    const blog = $derived(data.blog);
    const renderedContent = $derived(data.renderedContent);
    const result = $derived(renderedContent ? md.render(renderedContent) : "");
</script>

<svelte:head>
    <title>{blog.title}</title>
    <meta name="description" content={blog.excerpt || blog.title} />
    {#if data.coverImage}
        <meta property="og:image" content={data.coverImage} />
    {/if}
</svelte:head>

<article class="mx-auto w-full max-w-4xl px-4 py-16">
    <header class="mb-10">
        <h1
            class="mb-4 text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100"
        >
            {blog.title}
        </h1>

        <div
            class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-600 dark:text-neutral-400"
        >
            <time datetime={blog.created}>
                Created: {new Date(blog.created).toLocaleDateString()}
            </time>
            {#if blog.updated !== blog.created}
                <span>•</span>
                <time datetime={blog.updated}>
                    Updated: {new Date(blog.updated).toLocaleDateString()}
                </time>
            {/if}
            <span>•</span>
            <span>By {blog.author}</span>
        </div>
    </header>

    {#if data.coverImage}
        <div class="mb-10">
            <img
                src={data.coverImage}
                alt={blog.title}
                class="w-full rounded-lg object-cover"
            />
        </div>
    {/if}

    <div
        class="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400"
    >
        {@html result}
    </div>
</article>
