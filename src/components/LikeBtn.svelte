<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import Button from "./Button.svelte";
  import Icon from "./Icon.svelte";

  const dispatch = createEventDispatcher();
</script>

<div class="wrapper">
  <Button mode="outlined" on:click={(e) => dispatch("click", e.detail)}>
    <Icon name="heart" />
  </Button>
</div>

<style>
  .wrapper {
    --button-padding: 6px;
    font-size: 1rem;
    --button-color: var(--color-red);
    --button-bg-color: transparent;
  }
</style>
