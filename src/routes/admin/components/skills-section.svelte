<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';

	interface SkillCategory {
		id: string;
		category?: string;
		items?: string;
	}
	const resetSkillForm = () => {
		skillForm = { id: '', category: '', items: '' };
	};

	const editSkill = (skill: SkillCategory) => {
		skillForm = {
			id: skill.id,
			category: skill.category ?? '',
			items: skill.items ?? ''
		};
	};
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<!-- Form Card -->
	<Card>
		<CardHeader>
			<CardTitle>{skillForm.id ? 'Edit Skill Category' : 'Add Skill Category'}</CardTitle>
		</CardHeader>
		<CardContent>
				<input type="hidden" name="id" bind:value={skillForm.id} />
				<Input
					type="text"
					name="category"
					placeholder="Category"
					bind:value={skillForm.category}
					required
				/>
				<Textarea
					name="items"
					placeholder="Items (comma separated)"
					rows="4"
					bind:value={skillForm.items}
				/>
				<div class="flex gap-2">
					<Button on:click={() => submitSkillForm()}>{skillForm.id ? 'Update' : 'Add'}</Button>
					{#if skillForm.id}
						<Button variant="outline" on:click={() => resetSkillForm()}>
							Cancel
						</Button>
					{/if}
				</div>
		</CardContent>
	</Card>
	<Card>
		<CardHeader>
			<CardTitle>Current Skill Categories</CardTitle>
		</CardHeader>
		<CardContent class="space-y-2">
			{#each skills as item (item.id)}
				<div class="rounded-lg border p-3">
					<p class="font-medium">{item.category}</p>
					<p class="text-muted-foreground text-sm">{item.items}</p>
					<div class="mt-2 flex gap-2">
						<Button variant="outline" size="sm" on:click={() => editSkill(item)}>
							Edit
						</Button>
							<input type="hidden" name="id" bind:value={item.id} />
							<Button variant="destructive" size="sm" on:click={()=>deleteSkill(item.id)}>
								Delete
							</Button>
					</div>
				</div>
			{/each}
			{#if skills.length === 0}
				<p class="text-muted-foreground text-sm">No skill categories yet.</p>
			{/if}
		</CardContent>
	</Card>
</div>