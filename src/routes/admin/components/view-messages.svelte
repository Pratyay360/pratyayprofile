<script lang="ts">
	import { Trash } from "@lucide/svelte";

	interface MessageRecord {
		id: string;
		name?: string;
		email?: string;
		message?: string;
		created?: string;
	}

	export let messages: MessageRecord[] = [];
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">MESSAGES</h1>
	<div class="mt-10 space-y-6">
		{#each messages as message (message.id)}
			<div class="flex">
				<article class="rounded border p-4 w-full">
					<p class="font-medium">{message.name ?? 'Unknown'}</p>
					<p class="text-muted-foreground text-sm">{message.email ?? ''}</p>
					<p class="mt-3 whitespace-pre-wrap">{message.message ?? ''}</p>
					<p class="text-muted-foreground mt-2 text-xs">{message.created ?? ''}</p>
					<form method="POST" action="?/deleteMessage" class="mt-2">
						<input type="hidden" name="id" value={message.id} />
						<button type="submit" class="rounded border bg-destructive p-2 text-white h-10 w-10 flex items-center justify-center">
							<Trash class="h-4 w-4" />
						</button>
					</form>
				</article>
			</div>
		{/each}
		{#if messages.length === 0}
			<p class="text-muted-foreground text-center text-sm">No messages yet.</p>
		{/if}
	</div>
</section>
