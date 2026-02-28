<script lang="ts">
	interface Certificate {
		id: string;
		title?: string;
		description?: string;
		date?: string;
		link?: string;
	}

	export let certificates: Certificate[] = [];

	let certificateForm: {
		id: string;
		title: string;
		description: string;
		date: string;
		link: string;
	} = {
		id: '',
		title: '',
		description: '',
		date: '',
		link: ''
	};

	function resetCertificateForm(): void {
		certificateForm = { id: '', title: '', description: '', date: '', link: '' };
	}

	function editCertificate(certificate: Certificate): void {
		certificateForm = {
			id: certificate.id,
			title: certificate.title ?? '',
			description: certificate.description ?? '',
			date: certificate.date ?? '',
			link: certificate.link ?? ''
		};
	}
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<form method="POST" action="?/saveCertificate" enctype="multipart/form-data" class="space-y-3 rounded border p-4">
		<h2 class="text-lg font-medium">{certificateForm.id ? 'Edit Certificate' : 'Add Certificate'}</h2>
		<input type="hidden" name="id" value={certificateForm.id} />
		<input class="w-full rounded border p-2" name="title" placeholder="Title" bind:value={certificateForm.title} required />
		<input class="w-full rounded border p-2" name="date" placeholder="Date" bind:value={certificateForm.date} />
		<input class="w-full rounded border p-2" name="imageSrc" type="file" accept="image/*" />
		<input class="w-full rounded border p-2" name="link" placeholder="Certificate Link" bind:value={certificateForm.link} />
		<textarea class="w-full rounded border p-2" name="description" placeholder="Description" rows="4" bind:value={certificateForm.description}></textarea>
		<div class="flex gap-2">
			<button class="rounded border px-4 py-2" type="submit">{certificateForm.id ? 'Update' : 'Add'}</button>
			{#if certificateForm.id}
				<button class="rounded border px-4 py-2" type="button" onclick={resetCertificateForm}>Cancel</button>
			{/if}
		</div>
	</form>

	<div class="space-y-2 rounded border p-4">
		<h2 class="text-lg font-medium">Current Certificates</h2>
		{#each certificates as item (item.id)}
			<div class="rounded border p-3">
				<p class="font-medium">{item.title}</p>
				<p class="text-muted-foreground text-sm">{item.date}</p>
				<div class="mt-2 flex gap-2">
					<button class="rounded border px-3 py-1 text-sm" type="button" onclick={() => editCertificate(item)}>Edit</button>
					<form method="POST" action="?/deleteCertificate">
						<input type="hidden" name="id" value={item.id} />
						<button class="rounded border px-3 py-1 text-sm" type="submit">Delete</button>
					</form>
				</div>
			</div>
		{/each}
		{#if certificates.length === 0}
			<p class="text-muted-foreground text-sm">No certificates yet.</p>
		{/if}
	</div>
</div>
