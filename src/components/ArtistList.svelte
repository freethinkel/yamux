<script lang="ts">
  import type { Artist } from "../models/types";
  import { modalStore } from "../store/modal";
  import ArtistCard from "./ArtistCard.svelte";
  import ArtistSide from "../HOC/ArtistSide.svelte";

  export let artists: Artist[] = [];
  export let columns = 3;

  const openArtistPage = (artist: Artist) => {
    modalStore.openModal(ArtistSide, { isSidebar: true, props: { artist } });
  };
</script>

<div class="wrapper" style={`grid-template-columns: repeat(${columns}, 1fr);`}>
  {#each artists as artist}
    <ArtistCard on:select={() => openArtistPage(artist)} {artist} />
  {/each}
</div>

<style>
  .wrapper {
    overflow: auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 12px;
  }
</style>
