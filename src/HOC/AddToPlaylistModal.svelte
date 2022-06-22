<script lang="ts">
	import Button from '../components/Button.svelte';
	import { playlistStore } from '../store/playlist';
	import Card from '../components/Card.svelte';
	import type { Track } from '../models/types';
	import Cover from '../components/Cover.svelte';
	import { modalStore } from '../store/modal';
	export let track: Track;
</script>

<div class="wrapper">
	<Card>
		<h2>Добавить в плейлист</h2>

		<div class="track-info">
			<div class="cover">
				<Cover url={track.coverUri} size={50} />
			</div>
			<div class="track-info__description">
				<h4 class="track-info__title">{track.title}</h4>
				<div class="track-info__artists">
					{track.artists.map((a) => a.name).join(', ')}
				</div>
			</div>
		</div>

		<div class="playlists">
			{#each $playlistStore.playlists as playlist}
				<Button
					mode="outlined"
					on:click={() => {
						playlistStore.addTrack(playlist.kind, track);
						modalStore.closeModal();
					}}
				>
					<div class="playlist__inner">
						<div class="playlist__text">
							{playlist.title}
						</div>
						<div class="playlist__count">
							{playlist.trackCount || 0}
						</div>
					</div>
				</Button>
			{/each}
		</div>
	</Card>
</div>

<style>
	.wrapper {
		width: 400px;
	}
	.playlists {
		display: grid;
		grid-gap: 10px;
		max-height: 230px;
		overflow: auto;
	}
	.playlists :global(button) {
		width: 100%;
	}
	.playlist__inner {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
	.playlist__text {
		text-align: left;
		flex-grow: 1;
	}
	.playlist__count {
		color: var(--base-title);
		padding: 1px 3px;
		font-size: 0.8rem;
		font-weight: bold;
		border-radius: var(--border-radius);
	}
	.track-info {
		display: grid;
		grid-template-columns: auto 1fr;
		column-gap: 12px;
		padding: 12px 0;
	}
	.track-info__title {
		color: var(--base-title);
	}
	.track-info__artists {
		color: var(--base-text);
		font-size: 0.85rem;
	}
	.cover {
		height: 50px;
		width: 50px;
	}
</style>
