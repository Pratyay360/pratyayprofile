<script lang="ts">
	import favicon from "$lib/assets/favicon.svg";
	import { ModeWatcher } from "mode-watcher";
	import Navbar from "$lib/components/navbar/navbar.svelte";
	let { children } = $props();
</script>

<style >

@import "tw-animate-css";
@plugin "@tailwindcss/typography";



</style>


<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<ModeWatcher />
<Navbar />
{@render children()}
