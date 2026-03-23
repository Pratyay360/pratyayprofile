<script lang="ts" module>
    export interface EducationCardProps {
        date_from: string;
        date_to: string;
        category: string;
        title: string;
        description: string;
    }
</script>

<script lang="ts">
    import {
        Card,
        CardHeader,
        CardTitle,
        CardContent,
    } from "$lib/components/ui/card";
    const { date_from, date_to, category, title, description } = $props();
</script>

<Card class="flex flex-col gap-4 p-4 md:flex-row">
    <CardHeader class="flex-0 md:w-64">
        <CardTitle class="text-xl">{category}</CardTitle>
        <p class="text-sm">
            {date_from} – {date_to}
        </p>
    </CardHeader>
    <CardContent class="flex-1">
        <h3 class="mb-1 text-lg font-semibold">{title}</h3>
        <p class="text-muted-foreground text-lg">{description}</p>
    </CardContent>
</Card>
