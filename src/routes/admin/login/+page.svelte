<script lang="ts">
	let otpModal = false;
	let email = '';
	const reqotp = () => {
		const req = pb.collection('users').requestOTP(email);
		otpModal = true;
	}
</script>

<div class="container mx-auto px-6 py-8">
	<h1 class="text-2xl font-semibold">Admin Login</h1>
	<form class="mt-6 max-w-sm space-y-3">
		<label for="email" class="block text-sm font-medium">Email</label>
		<input
			id="email"
			type="email"
			class="w-full rounded border p-2 text-black"
			bind:value={email}
			required
		/>
		<button class="rounded-md border px-4 py-2" onclick={reqotp}>Request Otp</button>
	
	</form>
	{#if otpModal}
	<Dialog.Root>
 <Dialog.Trigger>Open</Dialog.Trigger>
 <Dialog.Content>
  <Dialog.Header>
   <Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
   <Dialog.Description>
    This action cannot be undone. This will permanently delete your account
    and remove your data from our servers.
   </Dialog.Description>
  </Dialog.Header>
 </Dialog.Content>
</Dialog.Root>
	{#fi}
</div>
