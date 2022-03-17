<script lang="ts">
  import Loader from "../components/Loader.svelte";
  import TrackCard from "../components/TrackCard.svelte";
  import type { Track } from "../models/types";
  import { playerStore } from "../store/player";

  import { playlistStore } from "../store/playlist";
  import TrackList from "./TrackList.svelte";

  const play = (track: Track) => {
    playerStore.setTrack(track, $playlistStore.likeds);
  };
</script>

<div class="wrapper">
  <h1>Мне нравится</h1>

  {#if !$playlistStore.likeds.length}
    <div class="loader">
      <Loader message="Загрузка.." />
    </div>
  {/if}

  <div class="track_list">
    <TrackList tracks={$playlistStore.likeds} allLikes />
  </div>
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
