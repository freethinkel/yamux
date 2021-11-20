<script lang="ts">
  import { onMount } from "svelte";
  import Loader from "../components/Loader.svelte";
  import TrackCard from "../components/TrackCard.svelte";
  import type { Track } from "../models/types";
  import { playerStore } from "../store/player";

  import { playlistStore } from "../store/playlist";

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
    {#each $playlistStore.likeds as track}
      <div class="track__card">
        <TrackCard
          {track}
          isLiked
          on:select={() => play(track)}
          isPlaying={$playerStore.track?.id === track.id}
        />
      </div>
    {/each}
  </div>
</div>

<style>
  .wrapper {
    padding: 0 12px;
  }
  .track_list {
    padding-bottom: 24px;
  }
  .track__card + .track__card {
    margin-top: 6px;
  }
  .loader {
    display: flex;
    justify-content: center;
    padding: 12px;
  }
</style>
