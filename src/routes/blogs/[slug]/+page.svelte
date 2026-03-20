<script lang="ts">
    import type { PageData } from "./$types";
    import { readString } from "$lib/content";
    import { parseAndRender } from "@ox-content/napi";
    let { data }: { data: PageData } = $props();

</script>

<article class="mx-auto w-full max-w-4xl px-4 py-16">
    <h1 class="mb-4 text-4xl font-bold tracking-tight">
        {readString(data.blog, "title")}
    </h1>

    <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        <time datetime={readString(data.blog, "created")}>
            Created: {new Date(
                readString(data.blog, "created"),
            ).toLocaleDateString()}
        </time>
        {#if readString(data.blog, "updated") && readString(data.blog, "updated") !== readString(data.blog, "created")}
            <span>•</span>
            <time datetime={readString(data.blog, "updated")}>
                Updated: {new Date(
                    readString(data.blog, "updated"),
                ).toLocaleDateString()}
            </time>
        {/if}
        {#if readString(data.blog, "author")}
            <span>•</span>
            <span>By {readString(data.blog, "author")}</span>
        {/if}
    </div>

    <div class="mb-10">
        <img
            src={data.coverImage}
            alt={readString(data.blog, "title")}
            class="w-full rounded-lg object-cover"
        />
    </div>

    <div
        class="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400"
    >
        {@html (parseAndRender(data.content, { gfm: true, footnotes: true, tables: true }))}
    </div>
</article>
