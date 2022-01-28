<script lang="ts">
  import type { Artist } from "../models/types";
  import Cover from "./Cover.svelte";

  export let artist: Artist;
</script>

<div class="wrapper">
  <div class="photo">
    <Cover url={artist.cover?.uri} size={75} />
  </div>
  <h5>{artist.name}</h5>
  <!-- <p>{artist.genres.join(", ")}</p> -->
</div>

<style>
  .wrapper {
    width: 75px;
    background: var(--base-panel);
    border-radius: var(--border-radius);
    padding: 3px;
  }

  .photo {
    height: 75px;
    margin-bottom: 2px;
  }

  h5 {
    word-break: break-word;
  }
</style>
