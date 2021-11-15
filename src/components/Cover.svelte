<script lang="ts" context="module">
  export const getCover = (url: string, size: number = 50) => {
    if (url == null) return null;
    var sizeParam = size.toString() + "x" + size.toString();
    return "https://" + url.replaceAll("%%", sizeParam);
  };
</script>

<script lang="ts">
  export let url: string;
  export let size = 50;

  $: parsedUrl = getCover(url, size * 2);
</script>

<div class="wrapper" style={`width: ${size}px; height: ${size}px;`}>
  <img src={parsedUrl} alt="" />
</div>

<style>
  .wrapper {
    overflow: hidden;
    border: 1px solid var(--colors-black12);
    border-radius: var(--border-radius);
  }
  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: center;
  }
</style>
