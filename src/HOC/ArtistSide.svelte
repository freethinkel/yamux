<script lang="ts">
  import { onMount } from "svelte";
  import type { Artist, ArtistInfo, Track } from "../models/types";
  import { ApiService } from "../services/api.service";

  import Cover from "../components/Cover.svelte";
  import Popup from "../components/Popup.svelte";
  import Icon from "../components/Icon.svelte";
  import Tabs from "../components/Tabs.svelte";
  import Loader from "../components/Loader.svelte";
  import TrackList from "./TrackList.svelte";

  export let artist: Artist;
  let artistInfo: ArtistInfo = null;
  let allTracks: Track[] = [];
  let loadAllTracks = false;
  let loadData = false;

  onMount(() => {
    loadData = true;
    ApiService.getArtist(artist.id).then((res) => {
      artistInfo = res.data.result;
      artist = artistInfo.artist;
      loadData = false;
    });
  });

  const loadTracks = async () => {
    if (!allTracks.length && !loadAllTracks) {
      loadAllTracks = true;
      const res = await ApiService.getArtistTracks(artist.id);
      allTracks = res.data.result.tracks;
      loadAllTracks = false;
    }
  };
</script>

<div class="wrapper">
  <div class="cover">
    <Cover url={artist.cover.uri} size={200} />
  </div>
  <div class="header">
    <h3 class="name">{artist.name}</h3>
    <Popup description={artist.description?.text || ""} maxWidth={400}>
      <Icon name="info-circle" />
    </Popup>
  </div>
  {#if loadData}
    <div class="loader">
      <Loader message="Загрузка.." />
    </div>
  {:else}
    <div class="tabs">
      <Tabs
        let:tab
        tabs={["Популярные треки", "Все треки", "Альбомы"]}
        on:change={({ detail }) => {
          if (detail === 1) loadTracks();
        }}
      >
        <div class="tab__body">
          {#if tab === 0}
            <TrackList tracks={artistInfo?.popularTracks || []} />
          {/if}
          {#if tab === 1}
            {#if loadAllTracks}
              <div class="loader">
                <Loader message="Загрузка.." />
              </div>
            {:else}
              <TrackList tracks={allTracks || []} />
            {/if}
          {/if}
        </div>
      </Tabs>
    </div>
  {/if}
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
  .name {
    font-size: 2.2rem;
    margin-right: 10px;
  }

  .tabs {
    height: 0;
    flex-grow: 1;
  }
  .tab__body {
    height: 100%;
  }

  .track__item {
    margin-top: 12px;
  }
</style>
