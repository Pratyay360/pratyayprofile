<script lang="ts">
	type LoginFormState = {
		email?: string;
		message?: string;
		error?: string;
	};

	let { form } = $props<{ form?: LoginFormState }>();
	const email = $derived(form?.email ?? '');
</script>

<div class="container mx-auto px-6 py-8">
	<h1 class="text-2xl font-semibold">Admin Login</h1>
	<p class="text-muted-foreground mt-2 text-sm">
		Authenticate with email and password.
	</p>

	<form method="POST" action="?/login" class="mt-6 max-w-sm space-y-3">
		<label for="email" class="block text-sm font-medium">Email</label>
		<input
			id="email"
			name="email"
			type="email"
			class="w-full rounded border p-2"
			value={email}
			required
		/>
		<label for="password" class="block text-sm font-medium">Password</label>
		<input
			id="password"
			name="password"
			type="password"
			class="w-full rounded border p-2"
			autocomplete="current-password"
			required
		/>
		<button class="rounded-md border px-4 py-2" type="submit">Login</button>
	</form>

	<!-- Commented out OTP verification form -->
	<!-- 
	{#if stage === 'otp'}
		<form method="POST" action="?/verifyOtp" class="mt-6 max-w-sm space-y-3">
			<input type="hidden" name="email" value={email} />
			<input type="hidden" name="otpId" value={otpId} />

			<div>
				<p class="block text-sm font-medium">Email</p>
				<p class="text-muted-foreground mt-1 text-sm">{email}</p>
			</div>
			<label for="otp" class="block text-sm font-medium">OTP</label>
			<input
				id="otp"
				name="otp"
				type="text"
				class="w-full rounded border p-2"
				autocomplete="one-time-code"
				required
			/>
			<button class="rounded-md border px-4 py-2" type="submit">Verify OTP</button>
		</form>
	{/if}
	-->

	{#if form?.message}
		<p class="mt-4 text-sm text-green-700 dark:text-green-400">{form.message}</p>
	{/if}
	{#if form?.error}
		<p class="mt-4 text-sm text-red-700 dark:text-red-400">{form.error}</p>
	{/if}
</div>
