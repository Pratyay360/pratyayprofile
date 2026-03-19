<script lang="ts">
  import favicon from "$lib/assets/favicon.svg";
  import Navbar from "$lib/components/navbar/navbar.svelte";
  import CatppuchinTheme from "$lib/themes/catppuchin.svelte";
  import BubblegumTheme from "$lib/themes/bubblegum.svelte";
  import CandyIconTheme from "$lib/themes/candyicon.svelte";
  import ClayMorphismTheme from "$lib/themes/claymorphism.svelte";
  import ModernMinimalTheme from "$lib/themes/modernminimal.svelte";
  import PastedreamTheme from "$lib/themes/pasteldreams.svelte";
  import VintagePaperTheme from "$lib/themes/vintagepaper.svelte";
  import VioletBloomTheme from "$lib/themes/violetbloom.svelte";
  import { theme } from "$lib/theme";
  import { ModeWatcher } from "mode-watcher";
  import "./layout.css";
  let { children } = $props();
  let chosenStyle = [
    { id: "catppuchin", component: CatppuchinTheme },
    { id: "bubblegum", component: BubblegumTheme },
    { id: "candyicon", component: CandyIconTheme },
    { id: "claymorphism", component: ClayMorphismTheme },
    { id: "modernminimal", component: ModernMinimalTheme },
    { id: "pastedream", component: PastedreamTheme },
    { id: "vintagepaper", component: VintagePaperTheme },
    { id: "violetbloom", component: VioletBloomTheme },
  ];

  let CurrentTheme = $derived(
    chosenStyle.find((s) => s.id === $theme)?.component 
  );
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<CurrentTheme  />

<ModeWatcher />
<Navbar />
{@render children()}
