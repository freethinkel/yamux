<script lang="ts">
  import type { Track } from '../models/types';

  import TrackCard from '../components/TrackCard.svelte';
  import { playerStore } from '../store/player';
  import { playlistStore } from '../store/playlist';
  import type { PlayList } from 'src/models/playlist';

  export let tracks: Track[];
  export let playlist: PlayList = null;
  export let allLikes: boolean = false;
  export let fromPlaylist = false;
  export let queueList = false;

  const play = (track: Track) => {
    playerStore.setTrack(track, tracks, { noShuffle: queueList });
  };
</script>

<div class="wrapper">
  {#each tracks as track, index}
    <div
      class="track__item"
      class:skipped={queueList &&
        $playerStore.queue.indexOf($playerStore.track) > index}
    >
      <TrackCard
        {track}
        {fromPlaylist}
        {playlist}
        isPlaying={$playerStore.track?.id === track.id}
        isLiked={allLikes ||
          playlistStore.isLiked(track, $playlistStore.likedTracks)}
        on:like={() => playlistStore.likeTrack(track)}
        on:select={() => play(track)}
      />
    </div>
  {:else}
    <div class="no-tracks">Нет песен</div>
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
  .skipped {
    opacity: 0.4;
  }

  .no-tracks {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 12px 0;
  }
</style>
