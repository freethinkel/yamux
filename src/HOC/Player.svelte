<script lang="ts">
  import { onMount } from "svelte";
  import Button from "../components/Button.svelte";
  import Cover from "../components/Cover.svelte";
  import Icon from "../components/Icon.svelte";
  import LikeBtn from "../components/LikeBtn.svelte";
  import Slider from "../components/Slider.svelte";
  import { ApiService } from "../services/api.service";

  import { playerStore } from "../store/player";
  import { playlistStore } from "../store/playlist";

  let audioEl: HTMLAudioElement;
  let isPlaying = false;
  let totalDuration = 0;
  let currentDuration = 0;

  const replay = () => {
    const _player = $playerStore;

    audioEl.onplay = () => {
      isPlaying = true;
    };
    audioEl.onpause = () => {
      isPlaying = false;
    };

    if (!audioEl.paused) {
      audioEl.pause();
    }

    audioEl.onloadeddata = (e) => {
      totalDuration = audioEl.duration;
    };

    audioEl.ontimeupdate = () => {
      currentDuration = audioEl.currentTime;
    };

    audioEl.onended = () => {
      playerStore.forwardQueue();
      isPlaying = false;
    };

    if (_player.track) {
      ApiService.getTrackUrl(_player.track?.id).then((url) => {
        audioEl.src = url;
        audioEl.play();
      });
    }
  };

  onMount(() => {
    navigator.mediaSession.setActionHandler("play", function () {
      audioEl.play();
    });
    navigator.mediaSession.setActionHandler("pause", function () {
      audioEl.pause();
    });
    navigator.mediaSession.setActionHandler("seekbackward", function () {
      /* Code excerpted. */
    });
    navigator.mediaSession.setActionHandler("seekforward", function () {
      /* Code excerpted. */
    });
    navigator.mediaSession.setActionHandler("previoustrack", function (e) {
      playerStore.backwardQueue();
    });
    navigator.mediaSession.setActionHandler("nexttrack", function () {
      playerStore.forwardQueue();
    });

    playerStore.subscribe((_player) => replay());
  });

  const setPosition = (newPos: number) => {
    audioEl.currentTime = totalDuration * newPos;
  };

  const getTime = (t) => {
    const m = ~~(t / 60);
    const s = (~~(t % 60)).toString().padStart(2, "0");

    return `${m}:${s}`;
  };
</script>

<div class="wrapper" data-tauri-drag-region>
  <div class="cover">
    <Cover url={$playerStore.track?.coverUri} size={50} />
  </div>
  <div class="controls">
    <Button
      mode="outlined"
      size="small"
      on:click={() => playerStore.backwardQueue()}
      ><Icon name="player-skip-back" /></Button
    >
    <Button
      mode="outlined"
      size="small"
      on:click={() => {
        audioEl.paused ? audioEl.play() : audioEl.pause();
      }}
    >
      {#if isPlaying}
        <Icon name="player-pause" />
      {:else}
        <Icon name="player-play" />
      {/if}
    </Button>
    <Button
      mode="outlined"
      size="small"
      on:click={() => playerStore.forwardQueue()}
      ><Icon name="player-skip-forward" /></Button
    >
  </div>
  <div class="content" data-tauri-drag-region>
    <div class="title" data-tauri-drag-region>
      {$playerStore.track?.title || ""}
    </div>
    <div class="artists" data-tauri-drag-region>
      {$playerStore.track?.artists?.map((e) => e.name)?.join(", ") || ""}
    </div>
  </div>
  <div class="right">
    <LikeBtn
      active={$playlistStore.likeds.some(
        (track) => track.id === $playerStore.track?.id
      )}
      on:click={() => {
        playlistStore.likeTrack($playerStore.track);
      }}
    />
    <div class="time">
      {getTime(currentDuration)} / {getTime(totalDuration)}
    </div>
  </div>
  <audio controls bind:this={audioEl} />
  <div class="position">
    <Slider
      disabled={totalDuration === 0}
      position={currentDuration / (totalDuration || 1)}
      on:change={({ detail }) => setPosition(detail)}
    />
  </div>
</div>

<style>
  audio {
    display: none;
  }

  .cover {
    width: 45px;
    height: 45px;
  }
  .wrapper {
    border-bottom: 1px solid var(--base-border);
    display: flex;
    align-items: center;
    padding: 0;
    position: relative;
    padding: 0 8px;
    padding-bottom: 2px;
  }

  .position {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 200;
    backdrop-filter: blur(9px);
    -webkit-backdrop-filter: blur(9px);
  }
  .controls {
    padding-left: 8px;
    display: flex;
    --button-padding: 4px;
    gap: 6px;
  }
  .controls :global(button) {
    align-items: center;
    justify-content: center;
    height: 28px;
    width: 28px;
  }

  .controls :global(button .icon) {
    font-size: 18px;
  }

  .right {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-end;
  }
  .time {
    font-size: 0.85rem;
  }
  audio {
    flex-grow: 1;
  }

  .content {
    flex-grow: 1;
    padding-left: 10px;
  }

  .title {
    font-size: 1.1rem;
    color: var(--base-title);
    font-weight: bold;
  }
  .artists {
    font-size: 0.85rem;
    color: var(--base-text);
  }
</style>
