<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Textarea } from "$lib/components/ui/textarea";
	import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";

	interface EducationEntry {
		id: string;
		degree?: string;
		institution?: string;
		period?: string;
		description?: string;
	}

	export let education: EducationEntry[] = [];

	let educationForm: {
		id: string;
		degree: string;
		institution: string;
		period: string;
		description: string;
	} = {
		id: '',
		degree: '',
		institution: '',
		period: '',
		description: ''
	};

	const resetEducationForm = () => {
		educationForm = { id: '', degree: '', institution: '', period: '', description: '' };
	};

	const editEducation = (item: EducationEntry) => {
		educationForm = {
			id: item.id,
			degree: item.degree ?? '',
			institution: item.institution ?? '',
			period: item.period ?? '',
			description: item.description ?? ''
		};
	};
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<Card>
		<CardHeader>
			<CardTitle>{educationForm.id ? 'Edit Education' : 'Add Education'}</CardTitle>
		</CardHeader>
		<CardContent>
			<form method="POST" action="?/saveEducation" class="space-y-3">
				<input type="hidden" name="id" value={educationForm.id} />
				<Input
					type="text"
					name="degree"
					placeholder="Degree"
					bind:value={educationForm.degree}
					required
				/>
				<Input
					type="text"
					name="institution"
					placeholder="Institution"
					bind:value={educationForm.institution}
				/>
				<Input
					type="text"
					name="period"
					placeholder="Period (e.g. 2021 - 2023)"
					bind:value={educationForm.period}
				/>
				<Textarea
					name="description"
					placeholder="Description"
					rows="4"
					bind:value={educationForm.description}
				/>
				<div class="flex gap-2">
					<Button type="submit">{educationForm.id ? 'Update' : 'Add'}</Button>
					{#if educationForm.id}
						<Button type="button" variant="outline" on:click={resetEducationForm}>
							Cancel
						</Button>
					{/if}
				</div>
			</form>
		</CardContent>
	</Card>

	<!-- Current Education Entries Card -->
	<Card>
		<CardHeader>
			<CardTitle>Current Education Entries</CardTitle>
		</CardHeader>
		<CardContent class="space-y-2">
			{#each education as item (item.id)}
				<div class="rounded-lg border p-3">
					<p class="font-medium">{item.degree}</p>
					<p class="text-muted-foreground text-sm">{item.institution}</p>
					<!-- Optional: show period and description if you want, but original only shows degree/institution -->
					<div class="mt-2 flex gap-2">
						<Button variant="outline" size="sm" on:click={() => editEducation(item)}>
							Edit
						</Button>
						<form method="POST" action="?/deleteEducation">
							<input type="hidden" name="id" value={item.id} />
							<Button variant="destructive" size="sm" type="submit">
								Delete
							</Button>
						</form>
					</div>
				</div>
			{/each}
			{#if education.length === 0}
				<p class="text-muted-foreground text-sm">No education entries yet.</p>
			{/if}
		</CardContent>
	</Card>
</div>