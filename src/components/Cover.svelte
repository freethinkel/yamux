<script lang="ts" context="module">
	export const getCover = (url: string, size: number = 50) => {
		if (url == null) return null;
		var sizeParam = size.toString() + 'x' + size.toString();
		return 'https://' + url.replaceAll('%%', sizeParam);
	};
</script>

<script lang="ts">
	import Icon from './Icon.svelte';

	export let url: string;
	export let size = 50;
	export let pictureSize: number = null;
	export let scalable = false;

	$: parsedUrl = getCover(url, pictureSize || size * 2);
</script>

<div class="wrapper" class:scalable={scalable && parsedUrl}>
	{#if parsedUrl}
		<img draggable="false" src={parsedUrl} alt="" />
	{/if}
	<div class="overlay" style={`font-size: ${size / 2.3}px;`}>
		<Icon name="music" />
	</div>
</div>

<style>
	.wrapper {
		overflow: hidden;
		border: 1px solid var(--base-border);
		border-radius: var(--border-radius);
		position: relative;
		height: 100%;
		width: 100%;
	}
	.scalable img {
		transition: 0.1s ease-in transform;
		transform-origin: top left;
		z-index: 1000;
	}
	.scalable {
		transition: 0.1s ease-in;
		overflow: unset !important;
	}
	.scalable:hover {
		border: 0px solid var(--base-border);
		overflow: unset !important;
	}
	.scalable:hover img {
		transform: scale(5);
		border: 1px solid transparent;
	}
	.scalable:hover .overlay {
		opacity: 0;
	}
	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: var(--base-overlay);
		border-radius: var(--border-radius);
		transition: 0.1s ease-in;
	}
	.overlay :global(.icon) {
		font-size: inherit;
	}
	img {
		left: 0;
		top: 0;
		position: absolute;
		z-index: 100;
		height: 100%;
		width: 100%;
		object-fit: cover;
		object-position: center;
		display: block;
		border-radius: calc(var(--border-radius) - 1px);
	}
</style>
