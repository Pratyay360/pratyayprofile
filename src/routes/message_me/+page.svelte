<script lang="ts">
	import { toast, Toaster } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';

	let name = '';
	let email = '';
	let message = '';
	let loading = false;

	async function handleSubmit(): Promise<void> {
		if (loading) return;
		loading = true;
		try {
			// Replace with a real endpoint when available.
			await new Promise((resolve) => setTimeout(resolve, 600));
			toast.success('Message sent!');
			name = '';
			email = '';
			message = '';
		} catch (e) {
			console.error(e);
			toast.error('Failed to send message.');
		} finally {
			loading = false;
		}
	}
</script>

<main class="bg-background flex min-h-screen items-center justify-center p-4">
	<Toaster />
	<Card class="w-full max-w-2xl border-slate-200 shadow-xl dark:border-slate-700">
		<CardHeader class="pb-4">
			<CardTitle class="text-foreground text-center text-3xl font-bold">Get in Touch</CardTitle>
			<CardDescription class="text-muted-foreground text-center">
				Have a question or want to collaborate?
			</CardDescription>
		</CardHeader>

		<CardContent>
			<form on:submit|preventDefault={handleSubmit} class="space-y-6">
				<div>
					<label for="name" class="text-foreground text-sm font-medium">Name</label>
					<Input
						id="name"
						name="Name"
						bind:value={name}
						placeholder="Your name"
						required
						class="border-slate-300 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:placeholder:text-slate-500"
					/>
				</div>

				<div>
					<label for="email" class="text-foreground text-sm font-medium">Email</label>
					<Input
						id="email"
						name="Email"
						type="email"
						bind:value={email}
						placeholder="you@example.com"
						required
						class="border-slate-300 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:placeholder:text-slate-500"
					/>
				</div>

				<div>
					<label for="message" class="text-foreground text-sm font-medium">Message</label>
					<Textarea
						id="message"
						name="Message"
						rows={5}
						bind:value={message}
						placeholder="Your message..."
						required
						class="resize-none border-slate-300 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500 dark:border-slate-600 dark:placeholder:text-slate-500"
					/>
				</div>

				<Button
					type="submit"
					disabled={loading}
					class="w-full bg-indigo-800 font-semibold text-white shadow-md transition-all hover:bg-indigo-700"
				>
					{loading ? 'Sending...' : 'Send Message'}
				</Button>
			</form>
		</CardContent>
	</Card>
</main>
