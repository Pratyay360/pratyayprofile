<script lang="ts">
    import type { PageData } from "./$types";
    import { readString } from "$lib/content";
    import {
        ArrowLeftIcon,
        CalendarDaysIcon,
        ClockIcon,
        UserIcon,
        TagIcon,
    } from "@lucide/svelte";
    let { data }: { data: PageData } = $props();

    function formatDate(dateString: string): string {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }

    function formatReadingTime(minutes: number): string {
        if (minutes < 1) return "< 1 min read";
        if (minutes === 1) return "1 min read";
        return `${minutes} min read`;
    }
</script>

<svelte:head>
    <title>{readString(data.blog, "title")} | Blog</title>
    <meta
        name="description"
        content={readString(data.blog, "brief") ||
            readString(data.blog, "title")}
    />
</svelte:head>

<article class="mx-auto w-full max-w-4xl px-4 py-8">
    <!-- Back Button -->
    <a
        href="/blogs"
        class="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
        <ArrowLeftIcon class="h-4 w-4" />
        Back to blogs
    </a>

    <!-- Header -->
    <header class="mb-8">
        <h1
            class="mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
        >
            {readString(data.blog, "title")}
        </h1>

        <!-- Meta Info -->
        <div
            class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground"
        >
            {#if readString(data.blog, "author")}
                <div class="flex items-center gap-1.5">
                    <UserIcon class="h-4 w-4" />
                    <span>{readString(data.blog, "author")}</span>
                </div>
            {/if}

            <div class="flex items-center gap-1.5">
                <CalendarDaysIcon class="h-4 w-4" />
                <time datetime={readString(data.blog, "created")}>
                    {formatDate(readString(data.blog, "created"))}
                </time>
            </div>

            {#if data.readingTime > 0}
                <div class="flex items-center gap-1.5">
                    <ClockIcon class="h-4 w-4" />
                    <span>{formatReadingTime(data.readingTime)}</span>
                </div>
            {/if}

            {#if readString(data.blog, "updated") && readString(data.blog, "updated") !== readString(data.blog, "created")}
                <span class="hidden sm:inline">•</span>
                <span class="text-xs">
                    Updated {formatDate(readString(data.blog, "updated"))}
                </span>
            {/if}
        </div>

        <!-- Tags -->
        {#if data.tags && data.tags.length > 0}
            <div class="mt-4 flex flex-wrap items-center gap-2">
                <TagIcon class="h-4 w-4 text-muted-foreground" />
                {#each data.tags as tag}
                    <span
                        class="bg-secondary text-secondary-foreground inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                    >
                        {tag}
                    </span>
                {/each}
            </div>
        {/if}
    </header>

    <!-- Content -->
    <div
        class="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-lg"
    >
        {@html data.rendered}
    </div>

    <!-- Related Posts -->
    {#if data.relatedPosts && data.relatedPosts.length > 0}
        <aside class="mt-16 border-t pt-12">
            <h2 class="mb-6 text-2xl font-bold">Related Posts</h2>
            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {#each data.relatedPosts as post}
                    <a href={post.link} class="group block">
                        <div class="overflow-hidden rounded-lg">
                            {#if post.images && post.images.length > 0}
                                <img
                                    src={post.images[0]}
                                    alt={post.title}
                                    class="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                            {:else}
                                <div class="bg-muted h-40 w-full"></div>
                            {/if}
                        </div>
                        <h3
                            class="mt-3 text-sm font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        >
                            {post.title}
                        </h3>
                    </a>
                {/each}
            </div>
        </aside>
    {/if}
</article>
