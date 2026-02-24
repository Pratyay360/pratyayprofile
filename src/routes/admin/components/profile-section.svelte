<script lang="ts">
	import { aboutMeStore, hashnodeHostStore, photoStore, resumeUrlStore, setAboutMe, setHashnodeHost, setPhoto, setResumeUrl } from '$lib/data/content-store';
	import { setStatus } from '../admin-store';

	let profileForm = {
		name: $photoStore.name,
		title: $photoStore.title,
		imageUrl: $photoStore.imageUrl,
		aboutMe: $aboutMeStore,
		resumeUrl: $resumeUrlStore,
		hashnodeHost: $hashnodeHostStore
	};

	function saveProfile(event: SubmitEvent): void {
		event.preventDefault();
		setPhoto({
			name: profileForm.name,
			title: profileForm.title,
			imageUrl: profileForm.imageUrl
		});
		setAboutMe(profileForm.aboutMe);
		setResumeUrl(profileForm.resumeUrl);
		setHashnodeHost(profileForm.hashnodeHost);
		setStatus('Profile updated.');
	}
</script>

<form onsubmit={saveProfile} class="mt-6 max-w-2xl space-y-4 rounded border p-4">
	<h2 class="text-lg font-medium">General Profile</h2>
	<div class="grid gap-4 md:grid-cols-2">
		<div class="space-y-1">
			<label for="profile-name" class="text-sm font-medium">Name</label>
			<input
				id="profile-name"
				class="w-full rounded border p-2 text-black"
				bind:value={profileForm.name}
			/>
		</div>
		<div class="space-y-1">
			<label for="profile-title" class="text-sm font-medium">Title</label>
			<input
				id="profile-title"
				class="w-full rounded border p-2 text-black"
				bind:value={profileForm.title}
			/>
		</div>
	</div>
	<div class="space-y-1">
		<label for="profile-image" class="text-sm font-medium">Profile Image URL</label>
		<input
			id="profile-image"
			class="w-full rounded border p-2 text-black"
			bind:value={profileForm.imageUrl}
		/>
	</div>
	<div class="space-y-1">
		<label for="profile-about" class="text-sm font-medium">About Me</label>
		<textarea
			id="profile-about"
			class="w-full rounded border p-2 text-black"
			rows="4"
			bind:value={profileForm.aboutMe}
		></textarea>
	</div>
	<div class="space-y-1">
		<label for="profile-resume" class="text-sm font-medium">Resume Link (Google Drive/etc)</label>
		<input
			id="profile-resume"
			class="w-full rounded border p-2 text-black"
			bind:value={profileForm.resumeUrl}
		/>
	</div>
	<div class="space-y-1">
		<label for="profile-hashnode" class="text-sm font-medium">Hashnode Hostname</label>
		<input
			id="profile-hashnode"
			class="w-full rounded border p-2 text-black"
			placeholder="yourname.hashnode.dev"
			bind:value={profileForm.hashnodeHost}
		/>
	</div>
	<button class="rounded border bg-primary px-4 py-2 text-primary-foreground" type="submit">
		Save Profile
	</button>
</form>
