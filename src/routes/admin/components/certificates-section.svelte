<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";

	interface CertificateEntry {
		id: string;
		title?: string;
		issuer?: string;
		description?: string;
		imageSrc?: string;
		date?: string;
		link?: string;
	}


	let certificateForm: {
		id: string;
		title: string;
		issuer: string;
		description: string;
		imageSrc: string;
		date: string;
		link: string;
	} = {
		id: '',
		title: '',
		issuer: '',
		description: '',
		imageSrc: '',
		date: '',
		link: ''
	};


	const editCertificate = (item: CertificateEntry) => {
		certificateForm = {
			id: item.id,
			title: item.title ?? '',
			issuer: item.issuer ?? '',
			description: item.description ?? '',
			imageSrc: item.imageSrc ?? '',
			date: item.date ?? '',
			link: item.link ?? ''
		};
	};

	const formatDate = (dateString: string) => {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
	};
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<Card>
		<CardHeader>
			<CardTitle>{certificateForm.id ? 'Edit Certificate' : 'Add Certificate'}</CardTitle>
		</CardHeader>
		<CardContent>
			<form method="POST" action="?/saveCertificate" class="space-y-3" enctype="multipart/form-data" use:enhance>
				<input type="hidden" name="id" value={certificateForm.id} />
				
				<Input
					type="text"
					name="title"
					placeholder="Certificate Title *"
					bind:value={certificateForm.title}
					required
				/>
				
				<Input
					type="text"
					name="issuer"
					placeholder="Issuing Organization *"
					bind:value={certificateForm.issuer}
					required
				/>
				
				<Input
					type="datetime-local"
					name="date"
					bind:value={certificateForm.date}
				/>
				
				<Input
					type="url"
					name="link"
					placeholder="Verification Link (https://...)"
					bind:value={certificateForm.link}
				/>
				
				<Input
					type="text"
					name="imageSrc"
					placeholder="Image Filename (e.g., certificate.jpg)"
					bind:value={certificateForm.imageSrc}
				/>
				
				<Textarea
					name="description"
					placeholder="Description"
					rows="4"
					bind:value={certificateForm.description}
				/>
				
				<div class="flex gap-2">
					<Button type="submit">{certificateForm.id ? 'Update' : 'Add'}</Button>
					{#if certificateForm.id}
						<Button type="button" variant="outline" on:click={resetCertificateForm}>
							Cancel
						</Button>
					{/if}
				</div>
			</form>
		</CardContent>
	</Card>

	<!-- Current Certificates Card -->
	<Card>
		<CardHeader>
			<CardTitle>Current Certificates</CardTitle>
		</CardHeader>
		<CardContent class="space-y-2">
			{#each certificates as item (item.id)}
				<div class="rounded-lg border p-4 space-y-2">
					<div class="flex items-start justify-between gap-3">
						<div class="flex-1 min-w-0">
							<p class="font-semibold text-base">{item.title}</p>
							<p class="text-muted-foreground text-sm">{item.issuer}</p>
							{#if item.date}
								<p class="text-xs text-muted-foreground mt-1">
									Issued: {formatDate(item.date)}
								</p>
							{/if}
							{#if item.link}
								<a 
									href={item.link} 
									target="_blank" 
									class="text-xs text-primary hover:underline block mt-1 truncate"
								>
									🔗 Verify Certificate
								</a>
							{/if}
							{#if item.description}
								<p class="text-sm mt-2 line-clamp-2">{item.description}</p>
							{/if}
							{#if item.imageSrc}
								<div class="mt-2">
									<img 
										src={`/uploads/${item.imageSrc}`} 
										alt={item.title}
										class="h-20 w-auto rounded-md object-cover border"
										on:error={(e) => {
											(e.target as HTMLImageElement).style.display = 'none';
										}}
									/>
								</div>
							{/if}
						</div>
					</div>
					
					<div class="flex gap-2 pt-2 border-t">
						<Button 
							variant="outline" 
							size="sm" 
							on:click={() => editCertificate(item)}
						>
							Edit
						</Button>
						<form method="POST" action="?/deleteCertificate">
							<input type="hidden" name="id" value={item.id} />
							<Button variant="destructive" size="sm" type="submit">
								Delete
							</Button>
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