<script lang="ts">
	import { onMount } from 'svelte';
	import type { Track } from '../models/types';
	import { ApiService } from '../services/api.service';
	import Loader from '../components/Loader.svelte';

	export let track: Track;
	let lyrics: string = '';
	let loading = false;

	onMount(() => {
		loading = true;
		ApiService.getLyrics(track.id).then((res) => {
			if (res.data.result.lyrics) {
				lyrics = res.data.result.lyrics.fullLyrics;
			}
			loading = false;
		});
	});
</script>

<div class="wrapper">
	<h3 class="track__name">
		{track.artists.map((artist) => artist.name).join(', ')} - {track.title}
	</h3>

	{#if loading}
		<div class="loader">
			<Loader message="Загрузка.." />
		</div>
	{:else if lyrics}
		<div class="lyrics">
			<pre>{lyrics.trim()}</pre>
		</div>
	{:else}
		<div class="not__found">Нет текста песни</div>
	{/if}
</div>

<style>
	.wrapper {
		padding: 12px 8px 0;
		background-color: var(--base-panel);
		-webkit-backdrop-filter: blur(9px);
		backdrop-filter: blur(9px);
		border-left: 12px;
		height: 100vh;
		width: 400px;
		display: flex;
		flex-direction: column;
	}
	.track__name {
		font-size: 2rem;
	}
	.loader {
		display: flex;
		justify-content: center;
		padding: 16px 0;
	}
	.not__found {
		text-align: center;
		padding: 16px 0;
	}
	.lyrics {
		overflow: auto;
		-webkit-user-select: auto;
		user-select: auto;
	}

	.lyrics pre {
		white-space: break-spaces;
		line-height: 1.4rem;
		font-size: 1rem;
	}
</style>
