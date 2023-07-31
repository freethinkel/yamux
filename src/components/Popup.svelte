<script lang="ts">
  import { fly } from 'svelte/transition';

  export let position: 'bottom' | 'top' = 'bottom';
  export let description: string = '';

  export let maxWidth = 300;
  let popupRef: HTMLDivElement;
  let wrapperRef: HTMLDivElement;

  let show = false;

  const onShow = () => {
    if (!description) {
      return;
    }
    let offset = 12;

    show = true;
    const el = wrapperRef;
    const rect = el.getBoundingClientRect();
    setTimeout(() => {
      popupRef.style.left = `${rect.x}px`;
      popupRef.style.top = `${rect.y + rect.height + offset}px`;

      if (popupRef.clientWidth > window.innerWidth - rect.left - offset) {
        popupRef.style.left = 'auto';
        popupRef.style.right = `${window.innerWidth - rect.right}px`;
      }
    });
  };
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
  class="wrapper"
  bind:this={wrapperRef}
  on:mouseenter={onShow}
  on:mouseleave={() => (show = false)}
>
  <slot />
  {#if show}
    <div
      in:fly={{ y: 10 }}
      out:fly={{ y: 10 }}
      class="popup"
      bind:this={popupRef}
      style={`max-width: ${maxWidth}px;`}
      class:position__bottom={position === 'bottom'}
      class:position__top={position === 'top'}
    >
      {description}
    </div>
  {/if}
</div>

<style>
  .wrapper {
    position: relative;
    cursor: pointer;
  }

  .popup {
    position: fixed;
    left: 0;
    background: var(--base-panel);
    border-radius: var(--border-radius);
    border: var(--base-overlay);
    backdrop-filter: blur(9px);
    -webkit-backdrop-filter: blur(9px);
    z-index: 1000;
    padding: 8px;
    pointer-events: none;
  }
</style>
