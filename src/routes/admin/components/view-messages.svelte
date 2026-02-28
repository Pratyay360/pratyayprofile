<script lang="ts">
	import { onMount } from 'svelte';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import PocketBase from 'pocketbase';

	interface MessageRecord {
		id: string;
		name?: string;
		email?: string;
		message?: string;
		created?: string;
	}

	const pb = new PocketBase(import.meta.env.VITE_POCKET_BASE);

	let loading = true;
	let messages: MessageRecord[] = [];
	let failed = false;

	onMount(async () => {
		try {
			messages = await pb.collection('messages').getFullList<MessageRecord>({});
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
		{#if failed}
			<p class="text-destructive text-center text-sm">Unable to load messages.</p>
		{/if}
		{#each messages as message (message.id)}
			<article class="rounded border p-4">
				<p class="font-medium">{message.name ?? 'Unknown'}</p>
				<p class="text-muted-foreground text-sm">{message.email ?? ''}</p>
				<p class="mt-3 whitespace-pre-wrap">{message.message ?? ''}</p>
				<p class="text-muted-foreground mt-2 text-xs">{message.created ?? ''}</p>
			</article>
		{/each}
		{#if messages.length === 0 && !loading && !failed}
			<p class="text-muted-foreground text-center text-sm">No messages yet.</p>
		{/if}
	</div>
</section>
