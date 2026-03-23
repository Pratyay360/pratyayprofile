<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import Navbar from "$lib/components/navbar/navbar.svelte";
  import { theme } from "$lib/theme";
  import { ModeWatcher } from "mode-watcher";
  import { browser } from "$app/environment";
  import "./layout.css";

  let { children } = $props();

  $effect(() => {
    if (browser) {
      document.documentElement.setAttribute("data-theme", $theme);
    }
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<Navbar />
{@render children()}
