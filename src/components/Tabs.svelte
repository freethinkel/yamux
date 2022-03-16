<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let tabs: string[] = [];

  let tab = 0;
  let headRef: HTMLDivElement;

  const dispatch = createEventDispatcher();

  const onSelectTab = (index: number) => {
    dispatch("change", index);

    const currEl = headRef.children[index] as HTMLElement;
    headRef.scrollTo({
      left: currEl.offsetLeft - headRef.offsetLeft - 50,
      behavior: "smooth",
    });
    tab = index;
  };
</script>

<div class="wrapper">
  <div class="head" bind:this={headRef}>
    {#each tabs as tabItem, index}
      <button
        class="tab"
        class:tab__active={tab === index}
        on:click={() => onSelectTab(index)}
        type="button">{tabItem}</button
      >
    {/each}
  </div>
  <div class="body">
    <slot {tab} />
  </div>
</div>

<style>
  .wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .head {
    display: flex;
    border-bottom: 1px solid var(--base-border);
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    -ms-overflow-style: -ms-autohiding-scrollbar;
  }
  .head::-webkit-scrollbar {
    display: none;
  }

  .body {
    height: 0;
    flex-grow: 1;
  }

  .tab {
    appearance: none;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    transition: var(--transition) border-color;
    padding: 0 10px;
    height: 32px;
    font-size: 0.9rem;
    color: var(--base-title);
    cursor: pointer;
    font-weight: bold;
    white-space: nowrap;
  }

  .tab__active {
    border-color: var(--base-primary);
  }
</style>
