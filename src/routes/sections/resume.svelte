<script lang="ts">
	let resumeUrl = import.meta.env.VITE_RESUME_URL! || '';
</script>

<section class="container mx-auto px-6 py-12">
	<h1 class="text-center text-3xl font-bold tracking-[0.2em]">RESUME</h1>
	<div class="mt-10 text-center">
		<a href={resumeUrl} target="_blank" rel="noopener noreferrer">
			<button
				class="relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-linear-to-br from-purple-500 to-pink-500 p-0.5 text-sm font-medium text-gray-900 transition-transform hover:scale-105 dark:text-white"
			>
				<span class="relative rounded-md bg-white px-5 py-2.5 transition-all dark:bg-gray-900">
					Show Resume
				</span>
			</button>
		</a>
	</div>
</section>
