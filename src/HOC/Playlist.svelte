<script lang="ts">
	import Loader from '../components/Loader.svelte';
	import { playlistStore } from '../store/playlist';
	import TrackList from './TrackList.svelte';

	export let playlistId: number;

	$: playlist = $playlistStore.playlists.find((p) => p.kind === playlistId);

	$: {
		playlistStore.getTracks(playlistId);
	}
</script>

<div class="wrapper">
	<div class="header">
		<h1>{playlist?.title}</h1>
		<p>Треков: {playlist.trackCount}</p>
	</div>

	{#if playlist.tracks === undefined}
		<div class="loader">
			<Loader message="Загрузка.." />
		</div>
	{/if}

	{#if playlist.tracks}
		<div class="track_list">
			<TrackList
				{playlist}
				fromPlaylist
				tracks={playlist?.tracks?.map((trackItem) => trackItem.track) || []}
			/>
		</div>
	{/if}
</div>

<style>
	.wrapper {
		padding: 0 12px;
	}
	.track_list {
		padding-bottom: 24px;
	}
	.loader {
		display: flex;
		justify-content: center;
		padding: 12px;
	}
	.header {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
</style>
