<script lang="ts">
  import Loader from '../components/Loader.svelte';

  import { playlistStore } from '../store/playlist';
  import TrackList from './TrackList.svelte';
</script>

<div class="wrapper">
  <div class="header">
    <h1>Мне нравится</h1>
    {#if $playlistStore.likedTracks.length}
      <p>Треков: {$playlistStore.likedTracks.length}</p>
    {/if}
  </div>

  {#if !$playlistStore.likedTracks.length}
    <div class="loader">
      <Loader message="Загрузка.." />
    </div>
  {/if}

  {#if $playlistStore.likedTracks.length}
    <div class="track_list">
      <TrackList tracks={$playlistStore.likedTracks} allLikes />
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
