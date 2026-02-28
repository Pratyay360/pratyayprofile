<script lang="ts">
	import { setStatus } from '../admin-';

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
		certificateForm = { title: '', description: '', date: '', imageSrc: '', link: '', issuer: '' };
		certificateEditingIndex = null;
	}

	function saveCertificate(event: SubmitEvent): void {
		event.preventDefault();
		if (!certificateForm.title.trim()) {
			setStatus('Certificate title is required.');
			return;
		}

		const next = [...$certificates];
		if (certificateEditingIndex === null) {
			next.push({ ...certificateForm });
			setStatus('Certificate added.');
		} else {
			next[certificateEditingIndex] = { ...certificateForm };
			setStatus('Certificate updated.');
		}
		setCertificates(next);
		resetCertificateForm();
	}

	function editCertificate(index: number): void {
		certificateForm = { ...$certificates[index] };
		certificateEditingIndex = index;
		setStatus('Editing certificate.');
	}

	function removeCertificate(index: number): void {
		setCertificates($certificates.filter((_, i) => i !== index));
		if (certificateEditingIndex === index) {
			resetCertificateForm();
		}
		setStatus('Certificate removed.');
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
			placeholder="Image URL"
			bind:value={certificateForm.imageSrc}
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
		{#each $certificates as item, index (item.title + index)}
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
