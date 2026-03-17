<script lang="ts">
	import { Check, Trash } from '@lucide/svelte';
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';

	interface MessageRecord {
		id: string;
		isRead?: boolean;
		name?: string;
		email?: string;
		message?: string;
		created?: string;
	}

	let { messages }: { messages: MessageRecord[] } = $props();
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">MESSAGES</h1>
	<div class="mt-10 space-y-6">
		{#each messages.filter((message) => !message.isRead) as message (message.id)}
			<Card>
				<CardHeader>
					<CardTitle>{message.name ?? 'Unknown'}</CardTitle>
					<CardDescription>{message.email ?? ''}</CardDescription>
				</CardHeader>
				<CardContent>
					<p class="whitespace-pre-wrap">{message.message ?? ''}</p>
				</CardContent>
				<CardFooter class="flex items-center justify-between">
					<span class="text-muted-foreground text-xs">{message.created ?? ''}</span>
					<form method="POST" action="?/readMessage" use:enhance>
						<Input type="hidden" name="id" value={message.id} />
						<Button variant="outline" size="icon" type="submit">
							<Check class="h-4 w-4" />
						</Button>
					</form>
				</CardFooter>
			</Card>
		{/each}

		<h2 class="text-lg font-medium">Already Read</h2>
		{#each messages.filter((message) => message.isRead) as message (message.id)}
			<Card>
				<CardHeader>
					<CardTitle>{message.name ?? 'Unknown'}</CardTitle>
					<CardDescription>{message.email ?? ''}</CardDescription>
				</CardHeader>
				<CardContent>
					<p class="whitespace-pre-wrap">{message.message ?? ''}</p>
				</CardContent>
				<CardFooter class="flex items-center justify-between">
					<span class="text-muted-foreground text-xs">{message.created ?? ''}</span>
					<form method="POST" action="?/deleteMessage" use:enhance>
						<Input type="hidden" name="id" value={message.id} />
						<Button variant="destructive" size="icon" type="submit">
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
