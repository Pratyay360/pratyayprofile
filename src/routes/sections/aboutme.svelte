<script lang="ts">
	import PocketBase from 'pocketbase';
	const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL);

	let loading = false;

	onMount(async () => {
		try {
			const res = await pb.collection('USER').getFirstListItem();
			aboutMe = res;
		} catch (e) {
			console.error(e);
			failed = true;
		} finally {
			loading = false;
		}
	});
</script>

<section class="container mx-auto px-6 py-12">
	<h2 class="text-center text-3xl font-bold tracking-[0.2em]">ABOUT ME</h2>
	<div class="text-muted-foreground mx-auto mt-8 max-w-3xl text-lg">
		<p></p>
	</div>
</section>
