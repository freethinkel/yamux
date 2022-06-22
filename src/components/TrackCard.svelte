<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import type { Track } from '../models/types';

	import Card from './Card.svelte';
	import Cover from './Cover.svelte';
	import LikeBtn from './LikeBtn.svelte';
	import ContextMenu from './ContextMenu.svelte';
	import { modalStore } from '../store/modal';
	import ArtistSide from '../HOC/ArtistSide.svelte';
	import LyricsSide from '../HOC/LyricsSide.svelte';
	import AlbumSide from '../HOC/AlbumSide.svelte';
	import AddToPlaylistModal from '../HOC/AddToPlaylistModal.svelte';
	import { playlistStore } from '../store/playlist';
	import type { PlayList } from '../models/playlist';

	export let track: Track;
	export let isLiked = false;
	export let fromPlaylist = false;
	export let playlist: PlayList = null;

	export let isPlaying: boolean = false;

	const dispatch = createEventDispatcher();
	const options = [
		{
			id: 'lyrics',
			label: 'Текст песни',
		},
		{
			id: 'add-to-playlist',
			label: 'Добавить в плейлист',
		},
		fromPlaylist
			? {
					id: 'remove-from-playlist',
					label: 'Удалить из плейлиста',
			  }
			: null,
		{
			divider: true,
		},
		{
			groupName: 'Испольнители',
		},
	]
		.filter((item) => item)
		.concat(
			track.artists.map((artist) => ({
				id: `artist_${artist.id}`,
				label: artist.name,
			}))
		)
		.concat([{ divider: true }])
		.concat([{ groupName: 'Альбомы' }])
		.concat(
			track.albums.map((album) => ({
				id: `album_${album.id}`,
				label: album.title,
			}))
		);

	const onContextMenu = (id: string) => {
		if (id.indexOf('artist') === 0) {
			const artist = track.artists.find(
				(artist) => String(artist.id) === id.split('_')[1]
			);
			modalStore.openModal(ArtistSide, {
				isSidebar: true,
				props: {
					artist,
				},
			});
		} else if (id === 'lyrics') {
			modalStore.openModal(LyricsSide, {
				isSidebar: true,
				props: { track },
			});
		} else if (id.indexOf('album') === 0) {
			console.log(id);
			const album = track.albums.find((a) => String(a.id) === id.split('_')[1]);
			modalStore.openModal(AlbumSide, { isSidebar: true, props: { album } });
		} else if (id === 'add-to-playlist') {
			modalStore.openModal(AddToPlaylistModal, { props: { track } });
		} else if (id === 'remove-from-playlist') {
			playlistStore.removeTrackFromPlaylist(playlist.kind, track);
		}
	};
</script>

<ContextMenu {options} on:select={({ detail }) => onContextMenu(detail)}>
	<button class="wrapper" on:click={() => dispatch('select')}>
		<Card>
			<div class="inner">
				<div class="cover">
					<Cover url={track.coverUri} size={40} />
					{#if isPlaying}
						<div class="cover__animation">
							<div />
							<div />
							<div />
						</div>
					{/if}
				</div>
				<div class="content">
					<div class="title">
						{track.title}
					</div>
					<div class="artists">
						{track.artists.map((a) => a.name).join(', ')}
					</div>
				</div>

				<div class="controls">
					<LikeBtn
						active={isLiked}
						on:click={(e) => {
							e.detail.stopPropagation();
							dispatch('like');
						}}
					/>
				</div>
			</div>
		</Card>
	</button>
</ContextMenu>

<style>
	.wrapper {
		--card-padding: 4px;
		width: 100%;
		padding: 0;
		margin: 0;
		cursor: pointer;
		border: none;
		outline: none;
		background: transparent;
	}
	.cover {
		position: relative;
		width: 50px;
		min-width: 50px;
		height: 50px;
	}
	.cover__animation {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: var(--base-overlay);
		border-radius: var(--border-radius);
		z-index: 101;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 2px;
	}

	.cover__animation div {
		width: 6px;
		height: 18px;
		background: var(--base-primary);
	}
	.cover__animation div:nth-child(1) {
		animation: 0.4s 0s playing_item ease-in-out infinite alternate;
	}
	.cover__animation div:nth-child(2) {
		animation: 0.4s 0.2s playing_item ease-in-out infinite alternate;
	}
	.cover__animation div:nth-child(3) {
		animation: 0.4s 0.4s playing_item ease-in-out infinite alternate;
	}
	.inner {
		display: flex;
		gap: 8px;
	}
	.title {
		font-size: 1rem;
		font-weight: bold;
		color: var(--base-title);
		text-align: left;
	}
	.artists {
		font-size: 0.85rem;
		color: var(--base-text);
		text-align: left;
	}
	.content {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}

	@keyframes playing_item {
		0% {
			transform: scaleY(0.5);
		}
		100% {
			transform: scaleY(1);
		}
	}
</style>
