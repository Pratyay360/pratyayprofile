<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';

	interface ProfileRecord {
		id: string;
		name?: string;
		description?: string;
	}

	let { profiles }: { profiles: ProfileRecord[] } = $props();

	let profileForm = $state({
		id: '',
		name: '',
		description: ''
	});

	const resetProfileForm = () => {
		profileForm = { id: '', name: '', description: '' };
	};

	const editProfile = (profile: ProfileRecord) => {
		profileForm = {
			id: profile.id,
			name: profile.name ?? '',
			description: profile.description ?? ''
		};
	};
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<form
		method="POST"
		action="?/saveProfile"
		enctype="multipart/form-data"
		class="space-y-4 rounded border p-4"
		use:enhance
	>
		<h2 class="text-lg font-medium">{profileForm.id ? 'Edit Profile' : 'Add Profile'}</h2>
		<Input type="hidden" name="id" value={profileForm.id} />
		<div class="space-y-1">
			<label for="profile-name" class="text-sm font-medium">Name</label>
			<Input id="profile-name" name="name" bind:value={profileForm.name} required />
		</div>
		<div class="space-y-1">
			<label for="profile-image" class="text-sm font-medium">Profile Image</label>
			<Input id="profile-image" name="image" type="file" accept="image/*" />
		</div>
		<div class="space-y-1">
			<label for="profile-description" class="text-sm font-medium">About Me</label>
			<Textarea
				id="profile-description"
				name="description"
				rows={4}
				bind:value={profileForm.description}
			/>
		</div>
		<div class="flex gap-2">
			<Button type="submit">{profileForm.id ? 'Update' : 'Save'}</Button>
			{#if profileForm.id}
				<Button type="button" variant="outline" onclick={resetProfileForm}>Cancel</Button>
			{/if}
		</div>
	</form>

	<div class="space-y-2 rounded border p-4">
		<h2 class="text-lg font-medium">Current Profiles</h2>
		{#each profiles as profile (profile.id)}
			<div class="rounded border p-3">
				<p class="font-medium">{profile.name ?? 'Untitled'}</p>
				<p class="text-muted-foreground text-sm">{profile.description ?? ''}</p>
				<div class="mt-2 flex gap-2">
					<Button type="button" variant="outline" size="sm" onclick={() => editProfile(profile)}>
						Edit
					</Button>
					<form method="POST" action="?/deleteProfile" use:enhance>
						<Input type="hidden" name="id" value={profile.id} />
						<Button type="submit" variant="destructive" size="sm">Delete</Button>
					</form>
				</div>
			</div>
		{/each}
		{#if profiles.length === 0}
			<p class="text-muted-foreground text-sm">No profile entries yet.</p>
		{/if}
	</div>
</div>
