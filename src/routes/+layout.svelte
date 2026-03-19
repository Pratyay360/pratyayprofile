<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import Navbar from "$lib/components/navbar/navbar.svelte";
  import CatppuchinTheme from "$lib/themes/catppuchin.svelte";
  import { ModeWatcher } from "mode-watcher";

  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<CatppuchinTheme />
<ModeWatcher />
<Navbar />
{@render children()}
