<script lang="ts">
	import { playlistStore } from '../store/playlist';

	import HomePage from './HomePage.svelte';

	import Sidebar from './Sidebar.svelte';
	import Playlist from './Playlist.svelte';
	import Player from './Player.svelte';
	import LikedPage from './LikedPage.svelte';
	import SeachPage from './SeachPage.svelte';
	import RadioPage from './RadioPage.svelte';
	import SettingsPage from './SettingsPage.svelte';
	import Resizable from '../components/Resizable.svelte';

	let page = 'home';

	$: currentPage = (() => {
		const _screen = {
			home: HomePage,
			settings: SettingsPage,
			liked: LikedPage,
			search: SeachPage,
			radio: RadioPage,
		}[page];

		if (_screen) {
			return { component: _screen, props: {} };
		}

		const playlistId = $playlistStore.playlists.find(
			(p) => p.kind.toString() === page
		)?.kind;

		if (typeof playlistId !== 'number') {
			return {
				component: HomePage,
				props: {},
			};
		}

		return {
			component: Playlist,
			props: {
				playlistId: playlistId,
			},
		};
	})();
</script>

<div class="wrapper">
	<Resizable width={200} min={170} max={350}>
		<div class="sidebar">
			<Sidebar selectedPage={page} on:setPage={(p) => (page = p.detail)} />
		</div>
	</Resizable>
	<div class="content">
		<div class="content__player">
			<Player />
		</div>
		<div class="content__inner">
			{#if currentPage && currentPage.component}
				<svelte:component this={currentPage.component} {...currentPage.props} />
			{/if}
		</div>
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		justify-content: space-between;
		height: 100%;
		min-height: 100vh;
	}
	.sidebar {
		border-right: 1px solid var(--base-border);
		height: 100vh;
	}
	.content {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		height: 100vh;
		position: relative;
		background: var(--base-background);
	}
	.content__player {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 200;
		background-color: var(--base-panel);
		backdrop-filter: blur(9px);
		-webkit-backdrop-filter: blur(9px);
	}
	.content__inner {
		padding-top: 60px;
		flex-grow: 1;
		overflow: auto;
	}
</style>
