<script lang="ts" module>
    export interface Props {
        title?: string;
        brief?: string;
        author?: string;
        updated?: string;
        created?: string;
        link?: string;
        tags?: string[];
        readingTime?: number;
        images?: string[];
    }
</script>

<script lang="ts">
    import {
        Card,
        CardTitle,
        CardDescription,
        CardContent,
        CardHeader,
    } from "$lib/components/ui/card";
    import { CalendarDaysIcon, ClockIcon, ImageIcon } from "@lucide/svelte";

    let {
        title = "",
        brief = "",
        author = "",
        updated = "",
        created = "",
        link = "",
        tags = [],
        readingTime = 0,
        images = [],
    }: Props = $props();

    const displayDate = $derived(updated || created || "");

    function formatDate(dateString: string): string {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    }

    function formatReadingTime(minutes: number): string {
        if (minutes < 1) return "< 1 min read";
        if (minutes === 1) return "1 min read";
        return `${minutes} min read`;
    }
</script>

<a
    href={link}
    class="block"
    aria-label={title ? `Open blog: ${title}` : "Open blog"}
>
    <Card
        class="group relative h-full overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
    >
        <CardContent class="flex flex-col gap-2 p-6">
            <CardHeader class="pb-2">
                <CardTitle
                    class="line-clamp-2 text-lg font-semibold leading-tight"
                    >{title}</CardTitle
                >
                {#if tags.length > 0}
                    <div class="flex flex-wrap gap-1.5 pt-2">
                        {#each tags.slice(0, 3) as tag}
                            <span
                                class="bg-secondary text-secondary-foreground inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium"
                            >
                                {tag}
                            </span>
                        {/each}
                        {#if tags.length > 3}
                            <span class="text-muted-foreground text-[10px]"
                                >+{tags.length - 3}</span
                            >
                        {/if}
                    </div>
                {/if}
                <div
                    class="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2"
                >
                    {#if author}
                        <p class="text-xs font-medium">
                            By {author}
                        </p>
                    {/if}
                    {#if displayDate}
                        <div
                            class="flex items-center gap-1 text-muted-foreground"
                        >
                            <CalendarDaysIcon class="h-3 w-3" />
                            <span class="text-xs"
                                >{formatDate(displayDate)}</span
                            >
                        </div>
                    {/if}
                    {#if readingTime > 0}
                        <div
                            class="flex items-center gap-1 text-muted-foreground"
                        >
                            <ClockIcon class="h-3 w-3" />
                            <span class="text-xs"
                                >{formatReadingTime(readingTime)}</span
                            >
                        </div>
                    {/if}
                    {#if images.length > 0}
                        <div
                            class="flex items-center gap-1 text-muted-foreground"
                        >
                            <ImageIcon class="h-3 w-3" />
                            <span class="text-xs">{images.length}</span>
                        </div>
                    {/if}
                </div>
            </CardHeader>
            <CardDescription class="line-clamp-3 text-sm leading-relaxed">
                {brief}
            </CardDescription>

            <!-- Show first image preview if available -->
            {#if images.length > 0}
                <div class="mt-3 overflow-hidden rounded-lg">
                    <img
                        src={images[0]}
                        alt=""
                        class="h-32 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            {/if}
        </CardContent>
    </Card>
</a>
