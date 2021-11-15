<script lang="ts">
  import Icon from "./Icon.svelte";
  import { createEventDispatcher } from "svelte";
  export let description: string = "";

  let input: HTMLInputElement;

  const dispatch = createEventDispatcher();

  const onChange = (event) => {
    const [file] = event.target.files;
    if (file) {
      dispatch("pick", file);
    }
  };
</script>

<label>
  <input bind:this={input} on:change={onChange} type="file" />
  <div class="icon">
    <Icon name="camera-plus" />
  </div>
  <div class="description">{description}</div>
</label>

<style>
  label {
    display: flex;
    background-color: var(--color-primary12);
    border-radius: var(--border-radius);
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    border: 2px dashed var(--color-primary);
    cursor: pointer;
    gap: 4px;
  }
  label :global(.ti) {
    color: var(--color-primary);
    font-size: 48px;
  }
  input {
    display: none;
  }
  .description {
    font-size: 1.1rem;
    font-weight: bold;
    color: var(--color-primary);
  }
</style>
