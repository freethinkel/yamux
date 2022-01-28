<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import type { Track } from "../models/types";

  import Card from "./Card.svelte";
  import Cover from "./Cover.svelte";
  import LikeBtn from "./LikeBtn.svelte";

  export let track: Track;
  export let isLiked = false;

  export let isPlaying: boolean = false;

  const dispatch = createEventDispatcher();
</script>

<button class="wrapper" on:click={() => dispatch("select")}>
  <Card>
    <div class="inner">
      <div class="cover">
        <Cover url={track.coverUri} size={40} />
        {#if isPlaying}
          <div class="cover__animation">
            <div />
            <div />
            <div />
          </div>
        {/if}
      </div>
      <div class="content">
        <div class="title">
          {track.title}
        </div>
        <div class="artists">
          {track.artists.map((a) => a.name).join(", ")}
        </div>
      </div>

      <div class="controls">
        <LikeBtn
          active={isLiked}
          on:click={(e) => {
            e.detail.stopPropagation();
            dispatch("like");
          }}
        />
      </div>
    </div>
  </Card>
</button>

<style>
  .wrapper {
    --card-padding: 4px;
    width: 100%;
    padding: 0;
    margin: 0;
    cursor: pointer;
    border: none;
    outline: none;
    background: transparent;
  }
  .cover {
    position: relative;
    width: 50px;
    min-width: 50px;
    height: 50px;
  }
  .cover__animation {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--base-overlay);
    border-radius: var(--border-radius);
    z-index: 101;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;
  }

  .cover__animation div {
    width: 6px;
    height: 18px;
    background: var(--base-primary);
  }
  .cover__animation div:nth-child(1) {
    animation: 0.4s 0s playing_item ease-in-out infinite alternate;
  }
  .cover__animation div:nth-child(2) {
    animation: 0.4s 0.2s playing_item ease-in-out infinite alternate;
  }
  .cover__animation div:nth-child(3) {
    animation: 0.4s 0.4s playing_item ease-in-out infinite alternate;
  }
  .inner {
    display: flex;
    gap: 8px;
  }
  .title {
    font-size: 1rem;
    font-weight: bold;
    color: var(--base-title);
  }
  .artists {
    font-size: 0.85rem;
    color: var(--base-text);
    text-align: left;
  }
  .content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  @keyframes playing_item {
    0% {
      transform: scaleY(0.5);
    }
    100% {
      transform: scaleY(1);
    }
  }
</style>
