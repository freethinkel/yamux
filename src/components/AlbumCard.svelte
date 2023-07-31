<script lang="ts">
  import type { Album } from 'src/models/album';
  import { createEventDispatcher } from 'svelte';
  import Card from './Card.svelte';
  import Cover from './Cover.svelte';

  export let album: Album;

  const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="wrapper" on:click={() => dispatch('select')}>
  <Card>
    <div class="cover">
      <Cover url={album.coverUri} size={100} />
    </div>
    <div class="title">
      {album.title}
    </div>
  </Card>
</div>

<style>
  .wrapper {
    --card-padding: 0;
    padding: 12px 0;
    cursor: pointer;
  }
  .cover {
    padding-top: 100%;
    position: relative;
  }
  .cover > :global(div) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .title {
    color: var(--base-title);
    font-size: 1.1rem;
    margin-top: 2px;
  }
</style>
