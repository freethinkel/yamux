<script lang="ts" context="module">
  export const getCover = (url: string, size: number = 50) => {
    if (url == null) return null;
    var sizeParam = size.toString() + "x" + size.toString();
    return "https://" + url.replaceAll("%%", sizeParam);
  };
</script>

<script lang="ts">
  import Icon from "./Icon.svelte";

  export let url: string;
  export let size = 50;

  $: parsedUrl = getCover(url, size * 2);
</script>

<div class="wrapper">
  {#if parsedUrl}
    <img draggable="false" src={parsedUrl} alt="" />
  {/if}
  <div class="overlay" style={`font-size: ${size / 2.3}px;`}>
    <Icon name="music" />
  </div>
</div>

<style>
  .wrapper {
    overflow: hidden;
    border: 1px solid var(--base-border);
    border-radius: var(--border-radius);
    position: relative;
    height: 100%;
    width: 100%;
  }
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--base-overlay);
  }
  .overlay :global(.icon) {
    font-size: inherit;
  }
  img {
    left: 0;
    top: 0;
    position: absolute;
    z-index: 100;
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    border-radius: calc(var(--border-radius) - 1px);
  }
</style>
