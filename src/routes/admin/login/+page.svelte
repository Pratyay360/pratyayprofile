<script lang="ts">
	import type { ActionData } from './$types';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	let { form }: { form: ActionData } = $props();
</script>

<div class="container mx-auto px-6 py-8">
	<h1 class="text-2xl font-semibold">Admin Login</h1>
	<p class="text-muted-foreground mt-2 text-sm">Authenticate with email and password.</p>

	<form method="POST" action="?/login" class="mt-6 max-w-sm space-y-3">
		<div>
			<label for="email" class="block text-sm font-medium">Email</label>
			<Input id="email" name="email" type="email" class="w-full rounded border p-2" required />
		</div>
		<div>
			<label for="password" class="block text-sm font-medium">Password</label>
			<Input
				id="password"
				name="password"
				type="password"
				class="w-full rounded border p-2"
				autocomplete="current-password"
				required
			/>
		</div>
		<Button class="rounded-md border px-4 py-2" type="submit">Login</Button>
	</form>

	{#if form?.error}
		<p class="mt-4 text-sm text-red-700 dark:text-red-400">{form.error}</p>
	{/if}
</div>
