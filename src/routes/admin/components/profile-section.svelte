<script lang="ts">
	interface ProfileRecord {
		id: string;
		name?: string;
		title?: string;
		description?: string;
	}

	export let profiles: ProfileRecord[] = [];

	let profileForm: {
		id: string;
		name: string;
		title: string;
		description: string;
	} = {
		id: '',
		name: '',
		title: '',
		description: ''
	};

	function resetProfileForm(): void {
		profileForm = { id: '', name: '', title: '', description: '' };
	}

	function editProfile(profile: ProfileRecord): void {
		profileForm = {
			id: profile.id,
			name: profile.name ?? '',
			title: profile.title ?? '',
			description: profile.description ?? ''
		};
	}
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<form method="POST" action="?/saveProfile" enctype="multipart/form-data" class="space-y-4 rounded border p-4">
		<h2 class="text-lg font-medium">{profileForm.id ? 'Edit Profile' : 'Add Profile'}</h2>
		<input type="hidden" name="id" value={profileForm.id} />
		<div class="grid gap-4 md:grid-cols-2">
			<div class="space-y-1">
				<label for="profile-name" class="text-sm font-medium">Name</label>
				<input
					id="profile-name"
					name="name"
					class="w-full rounded border p-2"
					required
					bind:value={profileForm.name}
				/>
			</div>
			<div class="space-y-1">
				<label for="profile-title" class="text-sm font-medium">Title</label>
				<input
					id="profile-title"
					name="title"
					class="w-full rounded border p-2"
					bind:value={profileForm.title}
				/>
			</div>
		</div>
		<div class="space-y-1">
			<label for="profile-image" class="text-sm font-medium">Profile Image</label>
			<input id="profile-image" name="image" class="w-full rounded border p-2" type="file" accept="image/*" />
		</div>
		<div class="space-y-1">
			<label for="profile-description" class="text-sm font-medium">About Me</label>
			<textarea
				id="profile-description"
				name="description"
				class="w-full rounded border p-2"
				rows="4"
				bind:value={profileForm.description}
			></textarea>
		</div>
		<div class="flex gap-2">
			<button class="bg-primary text-primary-foreground rounded border px-4 py-2" type="submit">
				{profileForm.id ? 'Update' : 'Save'}
			</button>
			{#if profileForm.id}
				<button class="rounded border px-4 py-2" type="button" onclick={resetProfileForm}>Cancel</button>
			{/if}
		</div>
	</form>

	<div class="space-y-2 rounded border p-4">
		<h2 class="text-lg font-medium">Current Profiles</h2>
		{#each profiles as profile (profile.id)}
			<div class="rounded border p-3">
				<p class="font-medium">{profile.name ?? 'Untitled'}</p>
				<p class="text-muted-foreground text-sm">{profile.title ?? ''}</p>
				<div class="mt-2 flex gap-2">
					<button class="rounded border px-3 py-1 text-sm" type="button" onclick={() => editProfile(profile)}>Edit</button>
					<form method="POST" action="?/deleteProfile">
						<input type="hidden" name="id" value={profile.id} />
						<button class="rounded border px-3 py-1 text-sm" type="submit">Delete</button>
					</form>
				</div>
			</div>
		{/each}
		{#if profiles.length === 0}
			<p class="text-muted-foreground text-sm">No profile entries yet.</p>
		{/if}
	</div>
</div>
