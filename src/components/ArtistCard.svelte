<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  import type { Artist } from '../models/types';
  import Cover from './Cover.svelte';

  export let artist: Artist;

  const dispatch = createEventDispatcher();
</script>

<div
  class="wrapper"
  role="button"
  tabindex="0"
  on:keydown={() => null}
  on:click={() => dispatch('select')}
>
  <div class="photo">
    <Cover url={artist.cover?.uri} size={75} />
  </div>
  <h5>{artist.name}</h5>
  <!-- <p>{artist.genres.join(", ")}</p> -->
</div>

<style>
  .wrapper {
    width: 100px;
    background: var(--base-panel);
    border-radius: var(--border-radius);
    padding: 3px;
    cursor: pointer;
  }

  .photo {
    height: 94px;
    margin-bottom: 2px;
  }

  h5 {
    font-size: 1.1rem;
    word-break: break-word;
  }
</style>
