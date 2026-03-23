<script lang="ts">
	type Ring = {
		size: number;
		color: string;
		animate: string;
	};

	const rings: Ring[] = [
		{ size: 330, color: 'border-gray-400/30 dark:border-gray-600/30', animate: 'animate-ping' },
		{ size: 400, color: 'border-red-400/40 dark:border-red-500/40', animate: 'animate-pulse' },
		{ size: 500, color: 'border-orange-400/40 dark:border-orange-500/40', animate: 'animate-ping' },
		{
			size: 650,
			color: 'border-yellow-400/30 dark:border-yellow-500/30',
			animate: 'animate-pulse'
		},
		{ size: 700, color: 'border-green-500/20 dark:border-green-400/20', animate: 'animate-ping' },
		{ size: 850, color: 'border-gray-300/10 dark:border-white/10', animate: 'animate-pulse' }
	];
</script>

<div class="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
	{#each rings as ring, i (ring.size)}
		<div
			class={`absolute rounded-full border ${ring.color} ${ring.animate} opacity-70 blur-[2px]`}
			style={`width: ${ring.size}px; height: ${ring.size}px; animation-duration: ${4 + i * 0.5}s; animation-delay: ${i * 0.2}s; border-width: ${1 + i * 0.5}px;`}
		></div>
	{/each}
	<div
		class="absolute h-63.75 w-63.75 rounded-full border border-gray-300/5 blur-[1px] dark:border-white/5"
	></div>
</div>
