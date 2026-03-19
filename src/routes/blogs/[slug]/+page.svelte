<script lang="ts">
    import { readString } from "$lib/content";
    import { parseAndRender } from "@ox-content/napi";

    let { data } = $props();
    const title = $derived(readString(data.blog, "title"));
    const created = $derived(readString(data.blog, "created"));
    const updated = $derived(readString(data.blog, "updated"));
    const author = $derived(readString(data.blog, "author"));
    const rendered = $derived(parseAndRender(data.content, {
        gfm: true,
        footnotes: true,
        tables: true,
    }));
</script>

<article class="mx-auto w-full max-w-4xl px-4 py-16">
    <header class="mb-10">
        <h1
            class="mb-4 text-4xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100"
        >
            {title}
        </h1>

        <div
            class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-600 dark:text-neutral-400"
        >
            <time datetime={created}>
                Created: {new Date(created).toLocaleDateString()}
            </time>
            {#if updated && updated !== created}
                <span>•</span>
                <time datetime={updated}>
                    Updated: {new Date(updated).toLocaleDateString()}
                </time>
            {/if}
            {#if author}
                <span>•</span>
                <span>By {author}</span>
            {/if}
        </div>
    </header>

    {#if data.coverImage}
        <div class="mb-10">
            <img
                src={data.coverImage}
                alt={title}
                class="w-full rounded-lg object-cover"
            />
        </div>
    {/if}

    <div class="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400">
        {@html rendered.html}
    </div>
</article>
