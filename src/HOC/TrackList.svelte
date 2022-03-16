<script lang="ts">
  import type { Track } from "../models/types";

  import TrackCard from "../components/TrackCard.svelte";
  import { playerStore } from "../store/player";
  import { playlistStore } from "../store/playlist";

  export let tracks: Track[];
  export let allLikes: boolean = false;

  const play = (track: Track) => {
    playerStore.setTrack(track, tracks);
  };
</script>

<div class="wrapper">
  {#each tracks as track}
    <div class="track__item">
      <TrackCard
        {track}
        isPlaying={$playerStore.track?.id === track.id}
        isLiked={allLikes ||
          playlistStore.isLiked(track, $playlistStore.likeds)}
        on:like={() => playlistStore.likeTrack(track)}
        on:select={() => play(track)}
      />
    </div>
  {/each}
</div>

<style>
  .wrapper {
    overflow: auto;
    height: 100%;
    padding-bottom: 12px;
  }
  .track__item {
    margin-top: 8px;
  }
</style>
