<script lang="ts">
  import AlbumSide from "../HOC/AlbumSide.svelte";

  import { modalStore } from "../store/modal";

  import type { Album } from "../models/album";
  import AlbumCard from "./AlbumCard.svelte";

  export let albums: Album[] = [];
  export let columns = 3;

  const openModal = (album: Album) => {
    modalStore.openModal(AlbumSide, { isSidebar: true, props: { album } });
  };
</script>

<div class="wrapper" style={`grid-template-columns: repeat(${columns}, 1fr);`}>
  {#each albums as album}
    <div class="album__item">
      <AlbumCard {album} on:select={() => openModal(album)} />
    </div>
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
