<script lang="ts">
  export let style: string = '';
</script>

<div data-tauri-drag-region {style}>
  <slot />
</div>

<style>
  div[data-tauri-drag-region] {
    position: relative;
    z-index: 999999999;
  }
</style>
