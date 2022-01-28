<script lang="ts">
  import ArtistCard from "../components/ArtistCard.svelte";

  import Input from "../components/Input.svelte";
  import Loader from "../components/Loader.svelte";
  import TrackCard from "../components/TrackCard.svelte";
  import type { Artist, Track } from "../models/types";
  import { ApiService } from "../services/api.service";
  import { playerStore } from "../store/player";
  import { playlistStore } from "../store/playlist";

  let timer;
  let loading = false;
  let tracks = [] as Track[];
  let artists = [] as Artist[];

  const search = async (query: string) => {
    try {
      loading = true;
      const res = await ApiService.search(query);
      console.log(res);
      tracks = res.data.result.tracks.results;
      artists = res.data.result.artists.results;
    } catch (err) {
      console.log(err);
    } finally {
      loading = false;
    }
  };

  const onInput = (val) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      search(val.detail);
    }, 300);
  };
</script>

<div class="wrapper">
  <Input label="Поиск" placeholder="Поиск песен" on:input={onInput} />

  {#if loading}
    <div class="loader">
      <Loader message="Загрузка.." />
    </div>
  {/if}

  <div class="artists">
    {#each artists as artist}
      <div class="artist__card">
        <ArtistCard {artist} />
      </div>
    {/each}
  </div>

  <div class="tracks">
    {#each tracks as track}
      <div class="track__card">
        <TrackCard
          {track}
          on:select={() => playerStore.setTrack(track, tracks)}
          isLiked={playlistStore.isLiked(track, $playlistStore.likeds)}
          isPlaying={$playerStore.track?.id === track.id}
        />
      </div>
    {/each}
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
  .track__card + .track__card {
    margin-top: 6px;
  }
  .artists {
    margin-top: 24px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .artist__card {
  }
</style>
