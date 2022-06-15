<script lang="ts">
  import Input from "../components/Input.svelte";
  import Loader from "../components/Loader.svelte";
  import type { Artist, Track } from "../models/types";
  import type { Album } from "../models/album";
  import { ApiService } from "../services/api.service";
  import TrackList from "./TrackList.svelte";
  import AlbumList from "../components/AlbumList.svelte";
  import ArtistList from "../components/ArtistList.svelte";

  let loading = false;
  let tracks: Track[] = [];
  let artists: Artist[] = [];
  let albums: Album[] = [];

  const search = async (query: string) => {
    try {
      loading = true;
      const res = await ApiService.search(query);
      tracks = res.data.result.tracks.results;
      artists = res.data.result.artists.results;
      albums = res.data.result.albums.results;
    } catch (err) {
    } finally {
      loading = false;
    }
  };

  const onSearch = (val: CustomEvent) => {
    search(val.detail);
  };
</script>

<div class="wrapper">
  <Input label="Поиск" placeholder="Поиск песен" on:submit={onSearch} />

  {#if loading}
    <div class="loader">
      <Loader message="Загрузка.." />
    </div>
  {/if}

  {#if artists.length}
    <div class="artists">
      <div class="section__title">Исполнители</div>

      <ArtistList {artists} columns={5} />
    </div>
  {/if}
  {#if albums.length}
    <div class="artists">
      <div class="section__title">Альбомы</div>

      <AlbumList {albums} columns={5} />
    </div>
  {/if}

  {#if tracks.length}
    <div class="tracks">
      <div class="section__title">Альбомы</div>

      <TrackList {tracks} />
    </div>
  {/if}
</div>

<style>
  .section__title {
    font-size: 1.5rem;
    color: var(--base-title);
    font-weight: bold;
    width: 100%;
  }
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
