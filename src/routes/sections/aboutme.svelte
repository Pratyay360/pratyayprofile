<script lang="ts">
	import { aboutMeStore } from '$lib/data/content-store';
</script>

<section class="container mx-auto px-6 py-12">
	<h2 class="text-center text-3xl font-bold tracking-[0.2em]">ABOUT ME</h2>
	<div class="text-muted-foreground mx-auto mt-8 max-w-3xl text-lg">
		<p>
			{$aboutMeStore}
		</p>
	</div>
</section>
