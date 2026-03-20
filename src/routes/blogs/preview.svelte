<script lang="ts">
  import type { RecordModel } from "pocketbase";
  import BlogCard from "$lib/components/normaluicomponents/blogCard.svelte";
  import { readString, resolveMediaUrl } from "$lib/content";
  import { createClient } from "$lib/pocketbase";
  import { Skeleton } from "$lib/components/ui/skeleton";

  interface BlogRecord {
    id: string;
    coverImage: string;
    title: string;
    brief: string;
    author: string;
    updated: string;
    created: string;
    link: string;
  }

  const pb = createClient(import.meta.env.VITE_POCKET_BASE);
  let loading = $state(true);
  let failed = $state(false);
  let posts = $state<BlogRecord[]>([]);

  try {
    const records = pb
      .collection("blogs")
      .getFullList<RecordModel>({ sort: "-created" });

    posts = records.map((record) => ({
      id: record.id,
      title: readString(record, "title"),
      author: readString(record, "author"),
      updated: readString(record, "updated"),
      created: readString(record, "created"),
      brief: readString(record, "brief") || readString(record, "content"),
      coverImage: resolveMediaUrl(pb, record, "coverImage", { token: null }),
      link: `/blogs/${record.id}`,
    }));
  } catch (error) {
    console.error("Failed to fetch blogs:", error);
    failed = true;
  } finally {
    loading = false;
  }
</script>

<main class="min-h-screen px-4 py-24">
  <h1 class="mb-16 text-center text-4xl font-bold tracking-wider md:text-5xl">
    Blogs.
  </h1>

  {#if loading && !failed}
    <div class="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
      {#each Array.from({ length: 6 }, (_, i) => i) as i (i)}
        <div class="space-y-3">
          <Skeleton class="h-56 w-full rounded-xl" />
          <Skeleton class="h-6 w-2/3" />
          <Skeleton class="h-4 w-full" />
          <Skeleton class="h-4 w-4/5" />
        </div>
      {/each}
    </div>
  {/if}
  {#if failed}
    <ErrorPage />
  {/if}
  {#if posts.length > 0}
    <section class="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
      {#each posts.slice(0, 3) as post (post.id)}
        <BlogCard {...post} />
      {/each}
    </section>
    {#if posts.length > 3}
      <div class="mt-8 text-center">
        <a href="/blogs">
          <Button
            class="border-primary hover:bg-primary hover:text-primary-foreground rounded-md border px-4 py-2 text-sm font-medium transition-colors"
            onClick={() => {redirect("/blogs")}}
            variant="ghost"
          >
            See More
          </Button>
        </a>
      </div>
    {/if}
  {/if}
</main>
