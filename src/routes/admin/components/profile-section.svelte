<script lang="ts">
	interface ProfileForm {
		name: string;
		title: string;
		imageUrl: string;
		aboutMe: string;
		resumeUrl: string;
	}

	let profileForm: ProfileForm = {
		name: '',
		title: '',
		imageUrl: '',
		aboutMe: '',
		resumeUrl: ''
	};

	function saveProfile(event: SubmitEvent): void {
		event.preventDefault();
		console.info('Profile save not wired yet', profileForm);
	}
</script>

<form onsubmit={saveProfile} class="mt-6 max-w-2xl space-y-4 rounded border p-4">
	<h2 class="text-lg font-medium">General Profile</h2>
	<div class="grid gap-4 md:grid-cols-2">
		<div class="space-y-1">
			<label for="profile-name" class="text-sm font-medium">Name</label>
			<input id="profile-name" class="w-full rounded border p-2" bind:value={profileForm.name} />
		</div>
		<div class="space-y-1">
			<label for="profile-title" class="text-sm font-medium">Title</label>
			<input id="profile-title" class="w-full rounded border p-2" bind:value={profileForm.title} />
		</div>
	</div>
	<div class="space-y-1">
		<label for="profile-image" class="text-sm font-medium">Profile Image URL</label>
		<input id="profile-image" class="w-full rounded border p-2" bind:value={profileForm.imageUrl} />
	</div>
	<div class="space-y-1">
		<label for="profile-about" class="text-sm font-medium">About Me</label>
		<textarea
			id="profile-about"
			class="w-full rounded border p-2"
			rows="4"
			bind:value={profileForm.aboutMe}
		></textarea>
	</div>
	<div class="space-y-1">
		<label for="profile-resume" class="text-sm font-medium">Resume Link (Google Drive/etc)</label>
		<input id="profile-resume" class="w-full rounded border p-2" bind:value={profileForm.resumeUrl} />
	</div>
	<button class="bg-primary text-primary-foreground rounded border px-4 py-2" type="submit">
		Save Profile
	</button>
</form>
