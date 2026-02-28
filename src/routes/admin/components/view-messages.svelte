<script lang="ts">
	import { onMount } from 'svelte';
	import PocketBase from 'pocketbase';
	const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

	let loading = $state(false);
	let messages = $state<PostNode[]>([]);
	let failed = $state(false);

	onMount(async () => {
		try {
			const res = await pb.collection('messages').getFullList({ sort: '-created' });
			messages = res;
		} catch (e) {
			console.error(e);
			failed = true;
		} finally {
			loading = false;
		}
	});
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">MESSAGES</h1>
	<div class="mt-10 space-y-6">
		{#if loading}
			<Skeleton class="h-32 w-full" />
		{/if}
		{#each messages as message (message.id)}
			<MessageCard
				name={message.name}
				email={message.email}
				message={message.message}
				created={message.created}
			/>
		{/each}
		{#if messages.length === 0 && !loading}
			<p class="text-muted-foreground text-center text-sm">No messages yet.</p>
		{/if}
	</div>
</section>      