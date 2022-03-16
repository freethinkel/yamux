<script lang="ts" context="module">
  export type Option =
    | {
        id: string | number;
        label: string;
        divider?: false | undefined;
      }
    | {
        id?: undefined;
        label?: undefined;
        divider: boolean;
      };
</script>

<script lang="ts">
  import { createEventDispatcher, onDestroy } from "svelte";
  import { fade } from "svelte/transition";

  export let options: Option[] = [];

  let isOpen = false;
  let blurAllowed = true;
  let popupRef: HTMLElement;
  let pos = {
    x: 0,
    y: 0,
  };

  const dispatch = createEventDispatcher();

  const onContextMenu = (event: MouseEvent) => {
    if (!options.length) {
      return;
    }

    blurAllowed = false;
    if (!isOpen) {
      isOpen = true;
    }
    pos.x = event.clientX;
    pos.y = event.clientY;
    setTimeout(() => {
      popupRef?.focus();
      blurAllowed = true;
    });
    document.body.addEventListener("mousedown", onClickBody);
    window.addEventListener("blur", close);
  };

  const close = () => {
    setTimeout(() => {
      if (blurAllowed) {
        document.body.removeEventListener("mousedown", onClickBody);
        window.removeEventListener("blur", close);
        isOpen = false;
      }
    });
  };

  onDestroy(() => {
    document.body.removeEventListener("mousedown", onClickBody);
    window.removeEventListener("blur", close);
  });

  const onClickBody = (event) => {
    if (popupRef.contains(event.target as HTMLElement)) return;
    close();
  };

  const onSelect = (option: Option) => {
    dispatch("select", option.id);
    close();
  };
  const onKeyDown = (event: KeyboardEvent) => {
    if (popupRef) {
      const buttons = Array.from(popupRef.querySelectorAll("button"));

      for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        if (document.activeElement === button) {
          buttons[length];
          break;
        }
      }
    }
  };
</script>

<div
  class="wrapper"
  on:contextmenu|preventDefault|stopPropagation={onContextMenu}
>
  <slot />
  {#if isOpen}
    <!-- svelte-ignore a11y-positive-tabindex -->
    <!-- svelte-ignore a11y-autofocus -->
    <div
      class="popup"
      tabindex="0 "
      autofocus
      bind:this={popupRef}
      on:contextmenu|preventDefault|stopPropagation
      on:keydown={onKeyDown}
      style={`left: ${pos.x}px; top: ${pos.y}px;`}
      transition:fade={{ duration: 100 }}
    >
      <ul>
        {#each options as option}
          {#if option.divider}
            <div class="divider" />
          {:else}
            <li>
              <button type="button" on:click={() => onSelect(option)}>
                {option.label}
              </button>
            </li>
          {/if}
        {/each}
      </ul>
    </div>
  {/if}
</div>

<style>
  .popup {
    position: fixed;
    top: 10px;
    left: 100px;
    z-index: 1000;
    border-radius: var(--border-radius);
    border: 1px solid var(--base-overlay);
    background: var(--base-overlay);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    transition: var(--transition);
    outline: none;
  }

  .popup ul {
    list-style: none;
    padding: 0;
    padding: 3px 0;
    margin: 0;
    display: flex;
    flex-direction: column;
  }
  .popup ul li {
    padding: 0 3px;
    min-width: 140px;
  }

  .popup ul button {
    list-style: none;
    appearance: none;
    margin: 0;
    padding: 0 10px;
    border: none;
    background: transparent;
    width: 100%;
    font-size: 1rem;
    color: var(--base-title);
    cursor: pointer;
    text-align: left;
    justify-content: flex-start;
    align-items: center;
    display: flex;
    height: 30px;
    border-radius: var(--border-radius);
  }
  .divider {
    width: calc(100% - 20px);
    border-bottom: 1px solid var(--base-overlay);
    margin: 4px 10px;
  }
  .popup ul button:hover,
  .popup ul button:focus {
    background: var(--base-overlay);
  }
</style>