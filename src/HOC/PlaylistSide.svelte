<script lang="ts">
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import Loader from "../components/Loader.svelte";

  import TrackCard from "../components/TrackCard.svelte";
  import type {
    GeneratedPlayList,
    GeneratedPlayListItem,
  } from "../models/feed";
  import type { PlayList } from "../models/playlist";

  import type { Track } from "../models/types";
  import { ApiService } from "../services/api.service";
  import { homeStore } from "../store/home";
  import { playerStore } from "../store/player";
  import { playlistStore } from "../store/playlist";

  export let title: string;
  export let playlist: PlayList;

  let tracks: Track[] = [];
  let loading = true;

  onMount(() => {
    let _tracks = $homeStore.cachedEntities[playlist.kind];
    if (_tracks) {
      tracks = _tracks;
      loading = false;
    } else {
      ApiService.getPlaylistInfo(playlist.kind, {
        userId: playlist.owner.uid,
      }).then((res) => {
        _tracks = res.data.result.tracks.map((e) => e.track);
        $homeStore.cachedEntities[playlist.kind] = _tracks;
        tracks = _tracks;
        loading = false;
      });
    }
  });
</script>

<div class="wrapper">
  <h3>{title}</h3>

  {#if loading}
    <div class="loader">
      <Loader message="Загрузка.." />
    </div>
  {/if}

  {#if !loading}
    <div class="tracks">
      {#each tracks as track}
        <div class="track__card">
          <TrackCard
            {track}
            on:select={() => playerStore.setTrack(track, tracks)}
            on:like={() => playlistStore.likeTrack(track)}
            isLiked={playlistStore.isLiked(track, $playlistStore.likeds)}
          />
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .wrapper {
    padding: 12px 8px;
    background-color: var(--color-white80);
    -webkit-backdrop-filter: blur(9px);
    backdrop-filter: blur(9px);
    border-left: 12px;
    height: 100%;
    width: 400px;
    display: flex;
    flex-direction: column;
  }

  .tracks {
    margin-top: 12px;
    flex-grow: 1;
    overflow: auto;
  }

  .track__card + .track__card {
    margin-top: 6px;
  }

  .loader {
    padding: 12px;
    display: flex;
    justify-content: center;
  }
</style>
