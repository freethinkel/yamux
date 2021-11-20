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
  <p>{artist.genres.join(", ")}</p>
</div>

<style>
  .wrapper {
    width: 75px;
  }

  h5,
  p {
    word-break: break-word;
  }
</style>
