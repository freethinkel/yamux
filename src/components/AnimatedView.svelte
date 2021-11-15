<script lang="ts">
	import { fly } from 'svelte/transition';
</script>

<div
	class="wrapper"
	in:fly={{ x: -10, duration: 100, delay: 200, y: 0 }}
	out:fly={{ x: 10, duration: 100, y: 0 }}
>
	<slot />
</div>

<style>
	.wrapper {
		position: relative;
	}
</style>
