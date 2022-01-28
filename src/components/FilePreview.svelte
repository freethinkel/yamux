<script lang="ts">
  import Loader from "./Loader.svelte";

  export let loading = false;
  export let file: File | undefined;

  let url: string;

  $: {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      url = String(reader.result);
    };
  }
</script>

<div class="wrapper">
  <img src={url} alt="" />
  <div class="loading">
    {#if loading}
      <Loader message="Загрузка" />
    {/if}
  </div>
</div>

<style>
  .wrapper {
    width: 100%;
    height: 100%;
    border-radius: var(--border-radius);
    overflow: hidden;
    background-color: var(--color-black12);
    position: relative;
  }
  img {
    object-fit: contain;
    height: 100%;
    width: 100%;
  }
  .loading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    background-color: var(--color-black50);
    --spinner-color: var(--color-white);
    --message-color: var(--color-white);
  }
</style>
