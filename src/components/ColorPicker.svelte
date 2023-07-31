<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let colors = [
    'rgba(235, 168, 102, 1)',
    '#1bd760',
    '#eea29a',
    '#15afb6',
    '#bbbbbb',
  ];
  export let color: string = '#3a9';

  const dispatch = createEventDispatcher();
  const changeColor = (_color: string) => {
    color = _color;
    dispatch('change', _color);
  };
</script>

<div class="wrapper">
  {#each colors as _color}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      on:click={() => changeColor(_color)}
      class="color-circle"
      class:active={_color === color}
      style={`--color: ${_color}`}
    />
  {/each}
</div>

<style>
  .wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .color-circle {
    height: 30px;
    width: 30px;
    border-radius: 30px;
    background-color: var(--color);
    cursor: pointer;
  }
  .active {
    box-shadow: 0 0 0 2px var(--base-title);
  }
</style>
