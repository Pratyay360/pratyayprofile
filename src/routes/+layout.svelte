<script lang="ts">
    import favicon from "$lib/assets/favicon.svg";
    import Navbar from "$lib/components/navbar/navbar.svelte";
    import { initTheme, theme } from "$lib/theme";
    import { ModeWatcher } from "mode-watcher";
    import { page } from "$app/stores";
    import "./layout.css";

    let { children } = $props();

    $effect(() => {
        document.documentElement.setAttribute("data-theme", $theme);
    });
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

{#if $page.data.theme}
    {@const _ = initTheme($page.data.theme)}
{/if}

<ModeWatcher />
<Navbar />
{@render children()}
