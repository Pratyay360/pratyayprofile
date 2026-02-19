<script context="module" lang="ts">
	export interface ImageCardInterface {
		image?: string;
		link?: string;
		name?: string;
	}
</script>

<script lang="ts">
	// Individual typed Svelte props so parents can pass values directly
	export let image: string = '#';
	export let link: string = '#';
	export let name: string = '#';

	/**
	 * Open the provided link in a new tab/window using noopener,noreferrer for safety.
	 * Using a button to trigger open avoids href linting for unresolved routes.
	 */
	function openLink(): void {
		if (!link) return;
		if (typeof window === 'undefined') return;
		try {
			window.open(link, '_blank', 'noopener,noreferrer');
		} catch {
			// ignore - best-effort open
		}
	}
</script>

{#if link}
	<button
		type="button"
		on:click={openLink}
		class="inline-block"
		aria-label={name ? `Open ${name}` : 'Open image'}
	>
		{#if image}
			<enhanced:img src={image} alt={name || ''} size="40" class="rounded-md object-cover" />
		{:else}
			<div
				class="h-10 w-10 rounded-md bg-gray-200"
				role="img"
				aria-label={name || 'image placeholder'}
			></div>
		{/if}
	</button>
{:else if image}
	<div class="inline-block" aria-label={name ? name : 'image'}>
		<enhanced:img
			src={image}
			alt={name || ''}
			sizes="40"
			class="rounded-md object-cover"
		/>
	</div>
{:else}
	<div
		class="h-10 w-10 rounded-md bg-gray-200"
		role="img"
		aria-label={name || 'image placeholder'}
	></div>
{/if}
