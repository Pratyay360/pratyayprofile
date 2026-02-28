<script lang="ts">
	import PocketBase from 'pocketbase';
	const pb = new PocketBase(import.meta.env.VITE_POCKET_BASE);
	interface Certificate {
		title: string;
		description: string;
		date: string;
		imageSrc: object;
		link: string;
		issuer: string;
	}

	const fileInput = document.getElementById('fileInput');
	let certificates: Certificate[]  = pb.collection('certificate').getFullList();
	let certificateForm: Certificate = {
		title: '',
		description: '',
		date: '',
		imageSrc: '',
		link: '',
		issuer: ''
	};
	let certificateEditingIndex: number | null = null;

	function resetCertificateForm(): void {
		certificateForm = { title: '', description: '', date: '', link: '', issuer: '' };
		certificateEditingIndex = null;
	}

	function saveCertificate(event: SubmitEvent): void {
		event.preventDefault();
		if (!certificateForm.title.trim()) {
			return;
		}

		if (certificateEditingIndex === null) {
			certificates = [...certificates, { ...certificateForm }];
			pb.collection('certificate').create(certificateForm);
		} else {
			certificates[certificateEditingIndex] = { ...certificateForm };
			certificates = [...certificates];
			pb.collection('certificate').update(certificateForm.id, certificateForm);
		}
		resetCertificateForm();
	}

	function editCertificate(index: number): void {
		certificateForm = { ...certificates[index] };
		certificateEditingIndex = index;
	}

	function removeCertificate(index: number): void {
		certificates = certificates.filter((_, i) => i !== index);
		if (certificateEditingIndex === index) {
			resetCertificateForm();
		}
	}
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<form onsubmit={saveCertificate} class="space-y-3 rounded border p-4">
		<h2 class="text-lg font-medium">
			{certificateEditingIndex === null ? 'Add Certificate' : 'Edit Certificate'}
		</h2>
		<input
			class="w-full rounded border p-2"
			placeholder="Title"
			bind:value={certificateForm.title}
		/>
		<input
			class="w-full rounded border p-2"
			placeholder="Issuer"
			bind:value={certificateForm.issuer}
		/>
		<input class="w-full rounded border p-2" placeholder="Date" bind:value={certificateForm.date} />
		<input
			class="w-full rounded border p-2"
			type="file"
			accept="image/*"	
			on:change={(e) => {
				const file = e.target.files?.[0];
				if (file) {
					imageSrc = file;
				}
			}}
		/>
		<input
			class="w-full rounded border p-2"
			placeholder="Certificate Link"
			bind:value={certificateForm.link}
		/>
		<textarea
			class="w-full rounded border p-2"
			placeholder="Description"
			rows="4"
			bind:value={certificateForm.description}
		></textarea>
		<div class="flex gap-2">
			<button class="rounded border px-4 py-2" type="submit">
				{certificateEditingIndex === null ? 'Add' : 'Update'}
			</button>
			{#if certificateEditingIndex !== null}
				<button class="rounded border px-4 py-2" type="button" onclick={resetCertificateForm}>
					Cancel
				</button>
			{/if}
		</div>
	</form>

	<div class="space-y-2 rounded border p-4">
		<h2 class="text-lg font-medium">Current Certificates</h2>
		{#each certificates as item, index (item.title + index)}
			<div class="rounded border p-3">
				<p class="font-medium">{item.title}</p>
				<p class="text-muted-foreground text-sm">{item.date}</p>
				<div class="mt-2 flex gap-2">
					<button class="rounded border px-3 py-1 text-sm" onclick={() => editCertificate(index)}>
						Edit
					</button>
					<button class="rounded border px-3 py-1 text-sm" onclick={() => removeCertificate(index)}>
						Delete
					</button>
				</div>
			</div>
		{/each}
	</div>
</div>
