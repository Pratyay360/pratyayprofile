<script lang="ts">
    import favicon from "$lib/assets/favicon.svg";
    import Navbar from "$lib/components/navbar/navbar.svelte";
    import { initTheme } from "$lib/theme";
    import { ModeWatcher } from "mode-watcher";
    import { onMount } from "svelte";
    import "./layout.css";

    let { data, children } = $props();

    // Initialize theme once from SSR cookie — the store subscriber handles persistence after that
    onMount(() => initTheme(data.theme ?? "catppuchin"));
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />
<Navbar />
{@render children()}
