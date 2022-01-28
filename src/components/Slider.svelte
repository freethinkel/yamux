<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  export let position = 0;
  export let disabled = false;

  let isMouseDown = false;
  let _position = 0;
  $: {
    if (!isMouseDown) {
      _position = position;
    }
  }

  const size = 12;
  let wrapperEl: HTMLDivElement;
  const dispatch = createEventDispatcher();

  onMount(() => {});

  const onMouseMove = (e: MouseEvent) => {
    const rect = wrapperEl.getBoundingClientRect();
    let pos = (e.clientX - rect.left) / wrapperEl.offsetWidth;

    if (pos > 0) {
      _position = pos;
    } else {
      _position = 0;
    }

    if (pos > 1) {
      _position = 1;
    }
  };
  const onMouseUp = () => {
    dispatch("change", _position);
    setTimeout(() => {
      isMouseDown = false;
    }, 100);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };
  const onMouseDown = () => {
    if (!disabled) {
      isMouseDown = true;
      document.addEventListener("mousemove", onMouseMove);

      document.addEventListener("mouseup", onMouseUp);
    }
  };

  const setPosition = (e: MouseEvent) => {
    if (!disabled) {
      const rect = wrapperEl.getBoundingClientRect();
      let pos = (e.clientX - rect.left) / wrapperEl.offsetWidth;
      _position = pos;

      dispatch("change", _position);
    }
  };
</script>

<div class="wrapper" bind:this={wrapperEl}>
  <div class="track" on:click={setPosition}>
    <div class="progress" style={`width: ${_position * 100}%`} />
  </div>
  <div
    class="point"
    on:mousedown={onMouseDown}
    style={`height: ${size}px; width: ${size}px; left: ${
      _position * 100
    }%; transform: translate(-${
      _position * 100
    }%, -50%) scale(var(--scale, 1));`}
  />
</div>

<style>
  .wrapper {
    position: relative;
    cursor: pointer;
  }
  .track {
    position: absolute;
    height: 5px;
    width: 100%;
    background-color: var(--color-black24);
    backdrop-filter: blur(9px);
    -webkit-backdrop-filter: blur(9px);
  }
  .progress {
    height: 100%;
    background-color: var(--color-primary);
  }
  .point {
    position: absolute;
    top: 2.5px;
    left: 0;
    border-radius: 100%;
    background-color: var(--color-primary);
    cursor: pointer;
  }
  .point:hover {
    --scale: 1.1;
  }
</style>
