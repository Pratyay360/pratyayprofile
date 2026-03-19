<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	interface CertificateEntry {
		id: string;
		title?: string;
		description?: string;
		date?: string;
		link?: string;
	}

	let { certificates }: { certificates: CertificateEntry[] } = $props();

	let certificateForm = $state({
		id: '',
		title: '',
		description: '',
		date: '',
		link: ''
	});

	const resetCertificateForm = () => {
		certificateForm = { id: '', title: '', description: '', date: '', link: '' };
	};

	const editCertificate = (item: CertificateEntry) => {
		certificateForm = {
			id: item.id,
			title: item.title ?? '',
			description: item.description ?? '',
			date: item.date ?? '',
			link: item.link ?? ''
		};
	};
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<Card>
		<CardHeader>
			<CardTitle>{certificateForm.id ? 'Edit Certificate' : 'Add Certificate'}</CardTitle>
		</CardHeader>
		<CardContent>
			<form
				method="POST"
				action="?/saveCertificate"
				enctype="multipart/form-data"
				class="space-y-3"
				use:enhance
			>
				<Input type="hidden" name="id" bind:value={certificateForm.id} />
				<Input type="text" name="title" placeholder="Certificate Title" bind:value={certificateForm.title} required />
				<Input type="date" name="date" bind:value={certificateForm.date} />
				<Input type="url" name="link" placeholder="Verification Link" bind:value={certificateForm.link} />
				<Input type="file" name="imageSrc" accept="image/*" />
				<Textarea
					name="description"
					placeholder="Description"
					rows={4}
					bind:value={certificateForm.description}
				/>
				<div class="flex gap-2">
					<Button type="submit">{certificateForm.id ? 'Update' : 'Add'}</Button>
					{#if certificateForm.id}
						<Button type="button" variant="outline" onclick={resetCertificateForm}>Cancel</Button>
					{/if}
				</div>
			</form>
		</CardContent>
	</Card>

	<Card>
		<CardHeader>
			<CardTitle>Current Certificates</CardTitle>
		</CardHeader>
		<CardContent class="space-y-2">
			{#each certificates as item (item.id)}
				<div class="rounded-lg border p-4 space-y-2">
					<p class="font-semibold text-base">{item.title}</p>
					{#if item.date}
						<p class="text-muted-foreground text-xs">{item.date}</p>
					{/if}
					{#if item.description}
						<p class="text-sm">{item.description}</p>
					{/if}
					{#if item.link}
						<a href={item.link} target="_blank" rel="noreferrer" class="text-primary text-sm hover:underline">
							View certificate
						</a>
					{/if}
					<div class="flex gap-2 border-t pt-2">
						<Button variant="outline" size="sm" type="button" onclick={() => editCertificate(item)}>
							Edit
						</Button>
						<form method="POST" action="?/deleteCertificate" use:enhance>
							<Input type="hidden" name="id" value={item.id} />
							<Button variant="destructive" size="sm" type="submit">Delete</Button>
						</form>
					</div>
				</div>
			{/each}

			{#if certificates.length === 0}
				<p class="text-muted-foreground text-sm">No certificates added yet.</p>
			{/if}
		</CardContent>
	</Card>
</div>
