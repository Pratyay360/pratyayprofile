<script lang="ts" module>
    export interface Props {
        title?: string;
        brief?: string;
        author?: string;
        updated?: string;
        coverImage?: string;
        created?: string;
        link?: string;
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
    import { AspectRatio } from "$lib/components/ui/aspect-ratio";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { CalendarDaysIcon } from "@lucide/svelte";
    import { enhance } from "$app/forms";

    let {
        title = "",
        brief = "",
        author = "",
        updated = "",
        coverImage = "",
        created = "",
        link = "",
    }: Props = $props();

    const displayDate = $derived(updated || created || "");
</script>

<a
    href={link}
    target="_blank"
    rel="noopener noreferrer"
    class="block"
    aria-label={title ? `Open blog: ${title}` : "Open blog"}
    use:enhance
>
    <Card
        class="group relative h-full overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
    >
        <div class="relative">
            <AspectRatio ratio={16 / 9}>
                {#if coverImage}
                    <img
                        src={coverImage}
                        alt={title || "Blog post cover"}
                        class="h-full w-full object-cover"
                    />
                {:else}
                    <Skeleton class="h-full w-full" />
                {/if}
            </AspectRatio>
        </div>

        <CardContent class="flex flex-col gap-2 pt-4">
            <CardHeader>
                <CardTitle
                    class="line-clamp-2 text-lg font-semibold leading-tight"
                    >{title}</CardTitle
                >
                <div class="mt-auto flex flex-col gap-1 pt-2">
                    <p class="text-xs font-medium ">
                        By {author}
                    </p>
                    {#if displayDate}
                        <div
                            class="flex items-center gap-1.5 "
                        >
                            <CalendarDaysIcon class="h-3.5 w-3.5" />
                            <span class="text-xs">{displayDate}</span>
                        </div>
                    {/if}
                </div>
            </CardHeader>
            <CardDescription class="line-clamp-3 text-sm leading-relaxed">
                {brief}
            </CardDescription>
        </CardContent>
    </Card>
</a>
