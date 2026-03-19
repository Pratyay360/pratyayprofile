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
	import { Textarea } from '$lib/components/ui/textarea';
    import Candyicon from '$lib/themes/candyicon.svelte';

	interface Message {
		id: string;
		name: string;
		email: string;
		message: string;
		isRead: boolean;
		created: string;
	}

	// Fixed: $props() is a function call
	let { messages = [] }: { messages: Message[] } = $props();

	// Fixed: Actually update the message status
	const markAsRead = (id: string) => {
  		const index = messages.findIndex((m) => m.id === id);
  		if (index !== -1) {
  			messages[index] = { ...messages[index], isRead: true };
  		}
	};
</script>

<div class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">MESSAGES</h1>
	
	<div class="mt-10 space-y-6">
		<!-- Unread Messages -->
		{#each messages.filter((m) => !m.isRead) as m (m.id)}
			<Card class="opacity-75">
				<CardHeader>
					<CardTitle>
					<span>
						{m.name}
					</span>
					</CardTitle>
					<CardDescription>
					   <span> {m.email}</span> 
					</CardDescription>
				</CardHeader>
				<CardContent>
				<span>{{</span>
				</CardContent>
				<CardFooter class="flex items-center justify-between">
					<span class="text-muted-foreground text-xs">{m.created}</span>
					<form method="POST" action="?/readMessage" use:enhance>
						<Input type="hidden" name="id" value={m.id} />
						<Button variant="destructive" size="icon" type="submit">
							<Check class="h-4 w-4" />
						</Button>
					</form>
				</CardFooter>
			</Card>
		{/each}

		<h2 class="text-lg font-medium">Already Read</h2>
		
		<!-- Read Messages -->
		{#each messages.filter((m) => m.isRead) as m (m.id)}
			<Card class="opacity-75">
				<CardHeader>
					<CardTitle>{m.name}</CardTitle>
					<CardDescription>{m.email}</CardDescription>
				</CardHeader>
				<CardContent>
					<Textarea value={m.message} readonly class="resize-none" />
				</CardContent>
				<CardFooter class="flex items-center justify-between">
					<span class="text-muted-foreground text-xs">{m.created}</span>
					<form method="POST" action="?/deleteMessage" use:enhance>
						<Input type="hidden" name="id" value={m.id} />
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
</div>
