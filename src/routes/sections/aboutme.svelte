<script lang="ts">
    import { onMount } from "svelte";
    import { createClient } from "$lib/pocketbase";
    import { readString, resolveMediaUrl } from "$lib/content";
    import { type RecordModel } from "pocketbase";

    const pb = createClient(import.meta.env.VITE_POCKET_BASE);
    let data: RecordModel[] = $state([]);
    let loading = $state(true);
    let failed = $state(false);

    onMount(async () => {
        try {
            const records = await pb
                .collection("me")
                .getFullList<RecordModel>({});
            if (records.length > 0) {
                data = records;
            }
        } catch (error) {
            console.error(error);
            failed = true;
        } finally {
            loading = false;
        }
    });
</script>

<section class="container mx-auto px-6 py-12">
    <div class="text-muted-foreground mx-auto mt-8 max-w-3xl text-lg">
        {#if loading}
            <p class="text-center text-5xl font-bold">Loading...</p>
        {:else if failed}
            <p class="text-destructive text-center text-5xl font-bold">
                Failed to load.
            </p>
        {:else if data.length > 0}
            {#each data as record (record.id)}
                <p
                    class="animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-primary pr-5 text-5xl text-foreground font-bold text-center"
                >
                    {record.flash}
                </p>
            {/each}
        {:else}
            <p class="text-muted-foreground text-center text-sm">
                No content to display.
            </p>
        {/if}
    </div>
</section>
