<script lang="ts">
  import { modalStore } from "../store/modal";

  import ArtistCard from "../components/ArtistCard.svelte";

  import Input from "../components/Input.svelte";
  import Loader from "../components/Loader.svelte";
  import TrackCard from "../components/TrackCard.svelte";
  import type { Artist, Track } from "../models/types";
  import { ApiService } from "../services/api.service";
  import { playerStore } from "../store/player";
  import { playlistStore } from "../store/playlist";
  import ArtistSide from "./ArtistSide.svelte";
  import TrackList from "./TrackList.svelte";

  let loading = false;
  let tracks = [] as Track[];
  let artists = [] as Artist[];

  const search = async (query: string) => {
    try {
      loading = true;
      const res = await ApiService.search(query);
      tracks = res.data.result.tracks.results;
      artists = res.data.result.artists.results;
    } catch (err) {
    } finally {
      loading = false;
    }
  };

  const onSearch = (val: CustomEvent) => {
    search(val.detail);
  };

  const openArtistPage = (artist: Artist) => {
    modalStore.openModal(ArtistSide, { isSidebar: true, props: { artist } });
  };
</script>

<div class="wrapper">
  <Input label="Поиск" placeholder="Поиск песен" on:submit={onSearch} />

  {#if loading}
    <div class="loader">
      <Loader message="Загрузка.." />
    </div>
  {/if}

  <div class="artists">
    {#each artists as artist}
      <div class="artist__card">
        <ArtistCard {artist} on:select={() => openArtistPage(artist)} />
      </div>
    {/each}
  </div>

  <div class="tracks">
    <TrackList {tracks} />
  </div>
</div>

<style>
  .wrapper {
    padding: 12px 12px 24px;
  }
  .loader {
    padding: 12px;
    display: flex;
    justify-content: center;
  }
  .tracks {
    margin-top: 12px;
  }
  .artists {
    margin-top: 24px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
</style>
