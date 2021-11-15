<script lang="ts">
  import { onMount } from "svelte";
  import { ApiService } from "../services/api.service";

  import { playerStore } from "../store/player";

  let audioEl: HTMLAudioElement;

  const replay = () => {
    const _player = $playerStore;

    if (!audioEl.paused) {
      audioEl.pause();
    }

    audioEl.onended = () => {
      playerStore.forwardQueue();
    };

    if (_player.track) {
      ApiService.getTrackUrl(_player.track?.id).then((url) => {
        audioEl.src = url;
        audioEl.play();
      });
    }
  };

  onMount(() => {
    playerStore.subscribe((_player) => replay());
  });
</script>

<div class="wrapper">
  <audio controls bind:this={audioEl} />
</div>

<style>
  .wrapper {
    /* height: 100px; */
    border-bottom: 1px solid red;
    display: flex;
    align-items: center;
    padding: 0 8px;
  }
  audio {
    width: 100%;
  }
</style>
