<script lang="ts">
	import Loader from '../components/Loader.svelte';

	import { playlistStore } from '../store/playlist';
	import TrackList from './TrackList.svelte';
</script>

<div class="wrapper">
	<div class="header">
		<h1>Мне нравится</h1>
		<p>Треков: {$playlistStore.likeds.length}</p>
	</div>

	{#if !$playlistStore.likeds.length}
		<div class="loader">
			<Loader message="Загрузка.." />
		</div>
	{/if}

	{#if $playlistStore.likeds.length}
		<div class="track_list">
			<TrackList tracks={$playlistStore.likeds} allLikes />
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
</style>
