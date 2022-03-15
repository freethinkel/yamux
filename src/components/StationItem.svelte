<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import Icon from "./Icon.svelte";

  export let name: string;
  export let description: string;
  export let color: string = "green";

  export let isPlaying: boolean = false;

  const dispatch = createEventDispatcher();
</script>

<button
  class="wrapper"
  style={`background-color: ${color};`}
  on:click={() => dispatch("select")}
>
  <div class="name">{name}</div>
  <div class="description">{description}</div>

  <div class="overlay" class:active={isPlaying}>
    <Icon name={isPlaying ? "player-pause" : "player-play"} />
  </div>
</button>

<style>
  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;
    cursor: pointer;
    border: none;
    margin: 0;
    min-height: 130px;
    position: relative;
    overflow: hidden;
    border-radius: var(--border-radius);
    width: 100%;
  }

  .wrapper:hover .overlay {
    opacity: 1;
  }

  .overlay.active {
    opacity: 1;
  }

  .overlay {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--base-panel);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
  }
  .overlay :global(.icon) {
    color: var(--base-text);
    font-size: 2rem;
  }
  .name {
    font-size: 1.3rem;
    color: var(--base-title);
    text-align: center;
    width: 100%;
    margin-bottom: 4px;
  }
  .description {
    font-size: 0.9rem;
    color: var(--base-title);
  }
</style>
