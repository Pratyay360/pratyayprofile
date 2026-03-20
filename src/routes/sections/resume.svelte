<script lang="ts">
    import { Button } from '$lib/components/ui/button';
	let resumeUrl = import.meta.env.VITE_RESUME_URL! || '';
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">RESUME</h1>
	<div class="mt-10 text-center">
		<a href={resumeUrl} target="_blank" rel="noopener noreferrer">
			<Button
				class="relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-105 hover:bg-primary/90"
			>
				<span>
					Show Resume
				</span>
			</Button>
		</a>
	</div>
</section>
