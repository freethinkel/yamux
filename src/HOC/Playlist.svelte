<script lang="ts">
  import Loader from "../components/Loader.svelte";

  import TrackCard from "../components/TrackCard.svelte";
  import type { Track } from "../models/types";
  import { playerStore } from "../store/player";

  import { playlistStore } from "../store/playlist";

  export let playlistId: number;

  $: playlist = $playlistStore.playlists.find((p) => p.kind === playlistId);

  $: {
    playlistStore.getTracks(playlistId);
  }

  const play = (track: Track) => {
    playerStore.setTrack(
      track,
      playlist.tracks.map((t) => t.track)
    );
  };
</script>

<div class="wrapper">
  <h1>{playlist?.title}</h1>

  {#if playlist.tracks === undefined}
    <div class="loader">
      <Loader message="Загрузка.." />
    </div>
  {/if}

  <div class="track_list">
    {#each playlist?.tracks || [] as trackItem}
      <div class="track__card">
        <TrackCard
          track={trackItem.track}
          isPlaying={$playerStore.track?.id === trackItem.track.id}
          on:select={() => play(trackItem.track)}
        />
      </div>
    {/each}
  </div>
</div>

<style>
  .wrapper {
    padding: 0 12px;
  }
  .track__card + .track__card {
    margin-top: 6px;
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
