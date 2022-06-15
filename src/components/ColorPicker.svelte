<script lang="ts">
  export let colors = [
    "rgba(235, 168, 102, 1)",
    "#1bd760",
    "#ff7a7a",
    "#bbbbbb",
  ];
  export let color: string = "#3a9";
</script>

<div class="wrapper">
  {#each colors as _color}
    <div
      on:click={() => (color = _color)}
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
