<script lang="ts">
  import { modalStore } from "../store/modal";

  $: {
    if ($modalStore.component) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
</script>

{#if $modalStore.component}
  <div class="wrapper">
    <div class="container">
      <svelte:component this={$modalStore.component} />
    </div>
  </div>
{/if}

<style>
  .wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-black50);
  }
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
