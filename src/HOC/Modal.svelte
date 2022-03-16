<script lang="ts">
  import { fade, fly } from "svelte/transition";

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
  <div class="wrapper" class:sidebar={$modalStore.isSidebar}>
    <div
      class="overlay"
      in:fade={{ duration: 100, delay: 200 }}
      out:fade={{ duration: 100 }}
      on:click={() => modalStore.closeModal()}
    />
    <div
      class="content"
      in:fly={{ x: 60, duration: 200, delay: 300, y: 0 }}
      out:fly={{ x: 60, duration: 200, y: 0 }}
    >
      <svelte:component this={$modalStore.component} {...$modalStore.props} />
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
    z-index: 9999;
  }

  .sidebar {
    justify-content: flex-end;
    align-items: flex-start;
  }
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9998;
    background-color: var(--base-overlay);
  }

  .sidebar .overlay {
    background-color: var(--base-overlay);
  }
  .content {
    z-index: 9999;
  }
</style>
