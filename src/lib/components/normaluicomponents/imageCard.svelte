<script module lang="ts">
    export interface ImageCardInterface {
        image?: string;
        link?: string;
        name?: string;
    }
</script>

<script lang="ts">
    // import button from "$lib/components/ui/button";
    const imageCardProps: ImageCardInterface = $props();
    let image: string = $derived(imageCardProps.image || "");
    let link: string = $derived(imageCardProps.link || "");
    let name: string = $derived(imageCardProps.name || "");
</script>

{#if link}
    {#if image}
        <enhanced:img
            src={image}
            alt={name || ""}
            sizes="40px"
            class="rounded-md object-cover"
        />
    {:else}
        <div
            class="h-10 w-10 rounded-md bg-muted"
            role="img"
            aria-label={name || "image placeholder"}
        ></div>
    {/if}
{:else if image}
    <div class="inline-block" aria-label={name ? name : "image"}>
        <enhanced:img
            src={image}
            alt={name || ""}
            sizes="40"
            class="rounded-md object-cover"
        />
    </div>
{:else}
    <div
        class="h-10 w-10 rounded-md bg-muted"
        role="img"
        aria-label={name || "image placeholder"}
    ></div>
{/if}
