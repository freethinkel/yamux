<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let mode: "raised" | "outlined" = "raised";
  export let size: "small" | "normal" | "large" = "normal";
  export let type: "button" | "submit" | "reset" = "button";
  export let disabled: boolean = false;

  const dispatch = createEventDispatcher();
</script>

<button
  {type}
  {disabled}
  on:click={(e) => dispatch("click", e)}
  class:raised={mode === "raised"}
  class:outlined={mode === "outlined"}
  class:size_small={size === "small"}
  class:size_normal={size === "normal"}
  class:size_large={size === "large"}
>
  <slot />
</button>

<style>
  button {
    --gap: 0;
    border: none;
    outline: none;
    display: flex;
    align-items: center;
    background: transparent;
    cursor: pointer;
    font-weight: normal;
    font-size: 1rem;
    height: var(--button-height, var(--height));
    padding: var(--button-padding, var(--padding));
    gap: var(--button-gap, var(--gap));
    border-radius: var(--border-radius);
    transition: var(--transition);
  }
  button:disabled {
    cursor: default;
    opacity: 0.6;
  }

  .raised {
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.12);
    background-color: var(--button-bg-color, var(--base-primary));
    color: var(--button-color, var(--base-text));
  }

  .outlined {
    background-color: var(--button-bg-color, var(--base-primary12));
    color: var(--button-color, var(--base-primary));
  }

  .size_small {
    --height: 24px;
    --font-size: 0.9rem;
    --padding: 0 6px;
  }

  .size_normal {
    --height: 32px;
    --font-size: 1rem;
    --padding: 0 12px;
  }
  .size_large {
    --height: 36px;
    --font-size: 1.1rem;
    --padding: 0 12px;
  }

  button:not(:disabled):hover {
    transform: scale(0.98);
  }
  button:not(:disabled):active {
    transform: scale(0.95);
  }
</style>
