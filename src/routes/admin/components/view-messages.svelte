<script lang="ts">
	import { Trash } from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from "$lib/components/ui/card";

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
			<Card>
				<CardHeader>
					<CardTitle>{message.name ?? 'Unknown'}</CardTitle>
					<CardDescription>{message.email ?? ''}</CardDescription>
				</CardHeader>
				<CardContent>
					<p class="whitespace-pre-wrap">{message.message ?? ''}</p>
				</CardContent>
				<CardFooter class="flex justify-between items-center">
					<span class="text-muted-foreground text-xs">{message.created ?? ''}</span>
					<form method="POST" action="?/deleteMessage">
						<input type="hidden" name="id" value={message.id} />
						<Button type="submit" variant="destructive" size="icon">
							<Trash class="h-4 w-4" />
						</Button>
					</form>
				</CardFooter>
			</Card>
		{/each}
		{#if messages.length === 0}
			<p class="text-muted-foreground text-center text-sm">No messages yet.</p>
		{/if}
	</div>
</section><script lang="ts">
	import { Trash } from "@lucide/svelte";
	import { Button } from "$lib/components/ui/button";
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from "$lib/components/ui/card";

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
			<Card>
				<CardHeader>
					<CardTitle>{message.name ?? 'Unknown'}</CardTitle>
					<CardDescription>{message.email ?? ''}</CardDescription>
				</CardHeader>
				<CardContent>
					<p class="whitespace-pre-wrap">{message.message ?? ''}</p>
				</CardContent>
				<CardFooter class="flex justify-between items-center">
					<span class="text-muted-foreground text-xs">{message.created ?? ''}</span>
					<form method="POST" action="?/deleteMessage">
						<input type="hidden" name="id" value={message.id} />
						<Button type="submit" variant="destructive" size="icon">
							<Trash class="h-4 w-4" />
						</Button>
					</form>
				</CardFooter>
			</Card>
		{/each}
		{#if messages.length === 0}
			<p class="text-muted-foreground text-center text-sm">No messages yet.</p>
		{/if}
	</div>
</section>