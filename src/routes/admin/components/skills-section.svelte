<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { readStringArray } from '$lib/content';

	interface SkillCategory {
		id: string;
		category?: string;
		items?: string[] | string;
	}

	let { skills }: { skills: SkillCategory[] } = $props();

	let skillForm = $state({
		id: '',
		category: '',
		items: ''
	});

	const resetSkillForm = () => {
		skillForm = { id: '', category: '', items: '' };
	};

	const editSkill = (skill: SkillCategory) => {
		skillForm = {
			id: skill.id,
			category: skill.category ?? '',
			items: Array.isArray(skill.items) ? skill.items.join(', ') : (skill.items ?? '')
		};
	};
</script>

<div class="mt-6 grid gap-6 lg:grid-cols-2">
	<Card>
		<CardHeader>
			<CardTitle>{skillForm.id ? 'Edit Skill Category' : 'Add Skill Category'}</CardTitle>
		</CardHeader>
		<CardContent>
			<form method="POST" action="?/saveSkill" class="space-y-3" use:enhance>
				<Input type="hidden" name="id" value={skillForm.id} />
				<Input type="text" name="category" placeholder="Category" bind:value={skillForm.category} required />
				<Textarea
					name="items"
					placeholder="Items (comma separated)"
					rows={4}
					bind:value={skillForm.items}
				/>
				<div class="flex gap-2">
					<Button type="submit">{skillForm.id ? 'Update' : 'Add'}</Button>
					{#if skillForm.id}
						<Button type="button" variant="outline" onclick={resetSkillForm}>Cancel</Button>
					{/if}
				</div>
			</form>
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
					<p class="text-muted-foreground text-sm">{readStringArray(item as unknown as Record<string, unknown>, 'items').join(', ')}</p>
					<div class="mt-2 flex gap-2">
						<Button variant="outline" size="sm" type="button" onclick={() => editSkill(item)}>
							Edit
						</Button>
						<form method="POST" action="?/deleteSkill" use:enhance>
							<Input type="hidden" name="id" value={item.id} />
							<Button variant="destructive" size="sm" type="submit">Delete</Button>
						</form>
					</div>
				</div>
			{/each}
			{#if skills.length === 0}
				<p class="text-muted-foreground text-sm">No skill categories yet.</p>
			{/if}
		</CardContent>
	</Card>
</div>
