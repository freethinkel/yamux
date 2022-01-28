<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import Button from "./Button.svelte";
  export let active = false;

  const dispatch = createEventDispatcher();
</script>

<div class="wrapper" class:active>
  <Button mode="outlined" on:click={(e) => dispatch("click", e.detail)}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="icon icon-tabler icon-tabler-heart"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path
        d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572"
      />
    </svg>
  </Button>
</div>

<style>
  .wrapper {
    --button-padding: 6px;
    font-size: 1rem;
    --button-color: var(--base-red);
    --button-bg-color: transparent;
  }

  .wrapper.active path:last-child {
    fill: var(--base-red);
  }
</style>
