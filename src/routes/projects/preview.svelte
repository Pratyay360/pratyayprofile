<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { Button } from "$lib/components/ui/button";
    import ProjectCard from "$lib/components/normaluicomponents/projectCard.svelte";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { createClient } from "$lib/pocketbase";
    import { readString, resolveMediaUrl } from "$lib/content";
    import type { RecordModel } from "pocketbase";

    interface ProjectRecord {
        id: string;
        imageUrl: string;
        title: string;
        brief: string;
        link: string;
    }

    const pb = createClient(import.meta.env.VITE_POCKET_BASE);
    let loading = true;
    let failed = false;
    let projects: ProjectRecord[] = [];

    onMount(async () => {
        try {
            const records = await pb
                .collection("project")
                .getFullList<RecordModel>({ sort: "-created" });
            projects = records.map((record) => ({
                id: record.id,
                imageUrl: resolveMediaUrl(pb, record, "imageUrl", {
                    token: null,
                }),
                title: readString(record, "title"),
                brief: readString(record, "brief"),
                link: readString(record, "link"),
            }));
        } catch (error) {
            console.error(error);
            failed = true;
        } finally {
            loading = false;
        }
    });
</script>

<div class="bg-background min-h-screen px-4 py-24">
    <h1 class="text-center text-3xl font-bold tracking-[0.2em]">PROJECTS</h1>

    {#if loading}
        <div class="mt-10">
            <Skeleton class="h-64 w-full" />
        </div>
    {/if}

    {#if failed}
        <p class="text-center text-sm">Unable to load projects.</p>
    {/if}

    <div class="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {#if projects.length >= 0}
            {#each projects.slice(0, 3) as project (project.id)}
                <ProjectCard
                    imageUrl={project.imageUrl}
                    title={project.title}
                    brief={project.brief}
                    link={project.link}
                />
            {/each}
        {/if}
    </div>

    {#if projects.length > 3}
        <div class="mt-8 text-center">
            <Button class="button-30" onclick={() => goto("/projects")}
                >See More</Button
            >
        </div>
    {/if}

    {#if projects.length === 0 && !loading && !failed}
        <p class="text-muted-foreground mt-8 text-center text-sm">
            Add your projects to display them here.
        </p>
    {/if}
</div>
