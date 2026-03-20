<script lang="ts">
  import ProjectCard from "$lib/components/normaluicomponents/projectCard.svelte";
  import { Skeleton } from "$lib/components/ui/skeleton";
  
  import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
  } from "$lib/components/ui/card";
  
  
  
  const profileName = "Pratyay Mustafi";
  let data = $props();
  const projects = data.projects ?? [];
</script>

<main class="min-h-screen px-4 py-24">
  <div class="mx-auto max-w-6xl">
    <header class="space-y-4 text-center">
      <h1 class="text-3xl font-bold tracking-[0.2em] lg:text-5xl">
        Projects By {profileName}
      </h1>
      <p class="text-muted-foreground mx-auto max-w-2xl">
        A collection of my recent works.
      </p>
    </header>

<section class="mt-12">
  <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {#each projects as project (project.id)}
    <ProjectCard
      imageUrl={project.imageUrl}
      title={project.title}
      brief={project.brief}
      link={project.link}
    />
  {/each}
  </div>
</section>
  </div>
</main>
