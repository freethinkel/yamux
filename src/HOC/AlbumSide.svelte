<script lang="ts">
  import { ApiService } from "../services/api.service";

  import { onMount } from "svelte";

  import Cover from "../components/Cover.svelte";
  import type { Album } from "../models/album";
  import type { Track } from "../models/types";
  import TrackList from "./TrackList.svelte";
  import Loader from "../components/Loader.svelte";

  export let album: Album;

  let tracks: Track[] = [];
  let loading = false;

  onMount(async () => {
    loading = true;
    const res = await ApiService.getAlbumTracks(album.id);
    tracks = (res.data.result.volumes || []).flat() || [];

    loading = false;
  });
</script>

<div class="wrapper">
  <div class="cover">
    <Cover url={album.coverUri} size={200} />
  </div>
  <div class="header">
    <h3 class="name" title={album.title}>{album.title}</h3>
  </div>
  <div class="body">
    {#if loading}
      <div class="loader">
        <Loader message="Загрузка.." />
      </div>
    {:else}
      <div class="tracks">
        <TrackList {tracks} />
      </div>
    {/if}
  </div>
</div>

<style>
  .wrapper {
    padding: 12px 8px 0;
    background-color: var(--base-panel);
    -webkit-backdrop-filter: blur(9px);
    backdrop-filter: blur(9px);
    border-left: 12px;
    height: 100vh;
    width: 400px;
    display: flex;
    flex-direction: column;
  }
  .loader {
    display: flex;
    justify-content: center;
    padding: 18px 0;
  }
  .cover {
    height: 200px;
  }
  .header {
    display: flex;
    align-items: center;
    margin-top: 10px;
  }
  .header h3 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .body {
    overflow: auto;
  }
  .name {
    font-size: 2.2rem;
    margin-right: 10px;
  }
</style>
