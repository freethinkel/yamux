<script lang="ts">
  import { playlistStore } from "../store/playlist";

  import HomePage from "./HomePage.svelte";

  import Sidebar from "./Sidebar.svelte";
  import Playlist from "./Playlist.svelte";
  import Player from "./Player.svelte";
  import LikedPage from "./LikedPage.svelte";
  import SeachPage from "./SeachPage.svelte";

  let page = "home";

  $: currentPage = (() => {
    const _screen = {
      home: HomePage,
      liked: LikedPage,
      search: SeachPage,
    }[page];

    if (_screen) {
      return { component: _screen, props: {} };
    }

    return {
      component: Playlist,
      props: {
        playlistId: $playlistStore.playlists.find(
          (p) => p.kind.toString() === page
        ).kind,
      },
    };
  })();
</script>

<div class="wrapper">
  <div class="sidebar">
    <Sidebar selectedPage={page} on:setPage={(p) => (page = p.detail)} />
  </div>
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
    border-right: 1px solid var(--color-black12);
    max-width: 210px;
    width: 100%;
    height: 100vh;
  }
  .content {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    max-height: 100vh;
    height: 100%;
    position: relative;
  }
  .content__player {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 200;
    background-color: var(--color-white80);
    backdrop-filter: blur(9px);
    -webkit-backdrop-filter: blur(9px);
  }
  .content__inner {
    padding-top: 60px;
    flex-grow: 1;
    overflow: auto;
  }
</style>
