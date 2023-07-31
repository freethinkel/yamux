<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Card from './Card.svelte';

  import Cover from './Cover.svelte';

  export let photo: string;
  export let title: string;

  const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="wrapper" on:click={() => dispatch('select')}>
  <Card>
    <div class="cover">
      <Cover url={photo} size={100} />
    </div>
    <h6 class="title">
      {title}
    </h6>
  </Card>
</div>

<style>
  .cover {
    width: 100%;
    height: 100px;
  }
  .wrapper {
    --card-padding: 4px;
    height: 100%;
    cursor: pointer;
  }
  .wrapper > :global(.card) {
    background-color: var(--enitity-background-color, var(--base-panel));
  }
  .wrapper > :global(div) {
    height: 100%;
  }
  .title {
    padding: 4px 2px;
    font-size: 0.8rem;
    max-height: 2.4rem;
    overflow: hidden;
  }
</style>
