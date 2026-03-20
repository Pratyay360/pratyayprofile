<script lang="ts">
    import { onMount } from "svelte";
    import ProjectCard from "$lib/components/normaluicomponents/projectCard.svelte";
    import { Skeleton } from "$lib/components/ui/skeleton";
    import { createClient } from "$lib/pocketbase";
    import { readString, resolveMediaUrl } from "$lib/content";
    import type { RecordModel } from "pocketbase";
    import Button from "$lib/components/ui/button/button.svelte";
    import { goto } from "$app/navigation";

    interface ProjectRecord {
        id: string;
        imageUrl: string;
        title: string;
        brief: string;
        link: string;
    }

    const pb = createClient(import.meta.env.VITE_POCKET_BASE);
    let loading = $state(true);
    let failed = $state(false);
    let projects = $state<ProjectRecord[]>([]);

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
            console.error("Failed to fetch projects:", error);
            failed = true;
        } finally {
            loading = false;
        }
    });
</script>

<main class="min-h-screen px-4 py-24">
    <div class="mx-auto max-w-6xl">
        <header class="space-y-4 text-center">
            <h1 class="text-3xl font-bold tracking-[0.2em] lg:text-5xl">
                Projects
            </h1>
            <p class="text-muted-foreground mx-auto max-w-2xl">
                A collection of my recent works.
            </p>
        </header>

        {#if loading && !failed}
            <div class="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {#each Array.from({ length: 3 }, (_, i) => i) as i (i)}
                    <Skeleton class="h-64 w-full rounded-xl" />
                {/each}
            </div>
        {/if}

        {#if failed}
            <p class="text-destructive mt-12 text-center text-sm">
                Failed to load projects. Please try again later.
            </p>
        {/if}

        {#if !loading && !failed}
            <section class="mt-12">
                <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {#each projects.slice(0, 3) as project (project.id)}
                        <ProjectCard
                            imageUrl={project.imageUrl}
                            title={project.title}
                            brief={project.brief}
                            link={project.link}
                        />
                    {/each}
                </div>

                {#if projects.length === 0}
                    <p class="text-muted-foreground mt-8 text-center text-sm">
                        Add your projects to display them here.
                    </p>
                {/if}

                {#if projects.length > 3}
                    <div class="mt-8 text-center">
                        <Button
                            onclick={() => {
                                goto("/projects");
                            }}
                            class="border-primary hover:bg-primary hover:text-primary-foreground inline-block rounded-md border px-4 py-2 text-sm font-medium transition-colors"
                        >
                            See More
                        </Button>
                    </div>
                {/if}
            </section>
        {/if}
    </div>
</main>
