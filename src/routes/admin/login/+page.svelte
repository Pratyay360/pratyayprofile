<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { authorized, setStatus, statusMessage } from '../admin-store';

	const pass = import.meta.env.VITE_PASS ?? '';
	let input = '';

	onMount(() => {
		// Check if already authorized
		const stored = localStorage.getItem('pass') ?? '';
		const isAuthorized = pass !== '' && stored === pass;
		authorized.set(isAuthorized);

		// Redirect to admin dashboard if already authorized
		if (isAuthorized) {
			goto('/admin');
		}
	});

	function handleSubmit(event: SubmitEvent): void {
		event.preventDefault();
		localStorage.setItem('pass', input);
		const isAuthorized = pass !== '' && input === pass;
		authorized.set(isAuthorized);
		setStatus(isAuthorized ? 'Authorized.' : 'Invalid password.');

		if (isAuthorized) {
			goto('/admin');
		}
	}
</script>

<div class="container mx-auto px-6 py-8">
	<h1 class="text-2xl font-semibold">Admin Login</h1>
	<form onsubmit={handleSubmit} class="mt-6 max-w-sm space-y-3">
		<label for="pass" class="block text-sm font-medium">Password</label>
		<input
			id="pass"
			type="password"
			class="w-full rounded border p-2 text-black"
			bind:value={input}
			required
		/>
		<button class="rounded-md border px-4 py-2" type="submit">Login</button>
		<p class="text-muted-foreground text-sm">Login to manage portfolio content.</p>
		{#if $statusMessage}
			<p class="text-sm">{$statusMessage}</p>
		{/if}
	</form>
</div>
