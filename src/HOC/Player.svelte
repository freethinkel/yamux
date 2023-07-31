<script lang="ts">
  import { stationsStore } from '../store/stations';
  import { modalStore } from '../store/modal';

  import { onDestroy, onMount } from 'svelte';
  import Button from '../components/Button.svelte';
  import Cover from '../components/Cover.svelte';
  import Icon from '../components/Icon.svelte';
  import LikeBtn from '../components/LikeBtn.svelte';
  import Slider from '../components/Slider.svelte';
  import ContextMenu from '../components/ContextMenu.svelte';
  import { ApiService } from '../services/api.service';
  import ArtistSide from '../HOC/ArtistSide.svelte';
  import LyricsSide from '../HOC/LyricsSide.svelte';
  import QueueSide from '../HOC/QueueSide.svelte';
  import AddToPlaylistModal from '../HOC/AddToPlaylistModal.svelte';

  import { playerStore } from '../store/player';
  import { playlistStore } from '../store/playlist';

  let audioEl: HTMLAudioElement;
  let isPlaying = false;
  let totalDuration = 0;
  let currentDuration = 0;
  let buffering = 0;

  const replay = () => {
    audioEl.onplay = () => {
      if ($playerStore.params.isRadio) {
        stationsStore.stationTrackStarted($playerStore.track);
      }
      isPlaying = true;
    };
    audioEl.onpause = () => {
      isPlaying = false;
    };

    if (!audioEl.paused) {
      audioEl.pause();
    }

    audioEl.onloadeddata = () => {
      totalDuration = audioEl.duration;
    };

    audioEl.ontimeupdate = () => {
      currentDuration = audioEl.currentTime;
    };

    audioEl.onended = () => {
      if ($playerStore.params.isRadio) {
        stationsStore.stationTrackFinished($playerStore.track);
      }
      playerStore.forwardQueue();
      isPlaying = false;
    };

    if ($playerStore.track) {
      ApiService.getTrackUrl($playerStore.track?.id).then((url) => {
        audioEl.src = url;
        audioEl.play();
      });
    }
  };

  onMount(() => {
    playerStore.channel.on('pause', () => {
      audioEl.pause();
    });

    playerStore.channel.on('play', () => {
      audioEl.play();
    });

    playerStore.channel.on('toggle', () => {
      if (audioEl.paused) {
        audioEl.play();
      } else {
        audioEl.pause();
      }
    });

    navigator.mediaSession.setActionHandler('play', function () {
      audioEl.play();
    });
    navigator.mediaSession.setActionHandler('pause', function () {
      audioEl.pause();
    });
    navigator.mediaSession.setActionHandler('seekbackward', function () {
      /* Code excerpted. */
    });
    navigator.mediaSession.setActionHandler('seekforward', function () {
      /* Code excerpted. */
    });
    navigator.mediaSession.setActionHandler('previoustrack', function () {
      playerStore.backwardQueue();
    });
    navigator.mediaSession.setActionHandler('nexttrack', function () {
      playerStore.forwardQueue();
    });

    let _oldTrack = $playerStore.track;

    playerStore.subscribe((_player) => {
      if (_player.track !== _oldTrack) {
        replay();
      }
      _oldTrack = _player.track;
    });

    audioEl.addEventListener('progress', function () {
      const duration = audioEl.duration;
      if (duration > 0) {
        for (let i = 0; i < audioEl.buffered.length; i++) {
          if (
            audioEl.buffered.start(audioEl.buffered.length - 1 - i) <
            audioEl.currentTime
          ) {
            buffering =
              audioEl.buffered.end(audioEl.buffered.length - 1 - i) / duration;
            break;
          }
        }
      }
    });
  });

  onDestroy(() => {
    audioEl.pause();
  });

  const setPosition = (newPos: number) => {
    audioEl.currentTime = totalDuration * newPos;
  };

  const getTime = (t: number) => {
    const m = ~~(t / 60);
    const s = (~~(t % 60)).toString().padStart(2, '0');

    return `${m}:${s}`;
  };

  const forwardQueue = () => {
    if ($playerStore.params.isRadio && audioEl) {
      stationsStore.stationSkip($playerStore.track, audioEl.duration);
    }
    playerStore.forwardQueue();
  };

  $: trackPosition = currentDuration / (totalDuration || 1);

  const cotextMenuOptions = [
    {
      label: 'Добавить в плейлист',
      id: 'add-to-playlist',
    },
    {
      label: 'Очередь воспроизведения',
      id: 'show-queue',
    },
    {
      label: 'Текст песни',
      id: 'lyrics',
    },
  ];
  const onSelectContextMenu = (id: string) => {
    if (id === 'add-to-playlist') {
      modalStore.openModal(AddToPlaylistModal, {
        props: { track: $playerStore.track },
      });
    } else if (id === 'lyrics') {
      modalStore.openModal(LyricsSide, {
        isSidebar: true,
        props: { track: $playerStore.track },
      });
    } else if (id === 'show-queue') {
      modalStore.openModal(QueueSide, {
        isSidebar: true,
        props: {},
      });
    }
  };
</script>

<ContextMenu
  options={$playerStore.track && cotextMenuOptions}
  on:select={({ detail }) => onSelectContextMenu(detail)}
>
  <div class="wrapper">
    <div class="cover">
      <Cover
        scalable
        pictureSize={300}
        url={$playerStore.track?.coverUri}
        size={50}
      />
    </div>
    <div class="controls">
      <Button
        mode="outlined"
        disabled={$playerStore.params.isRadio}
        size="small"
        on:click={() => playerStore.backwardQueue()}
      >
        <Icon name="player-skip-back" />
      </Button>
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
      <Button mode="outlined" size="small" on:click={forwardQueue}>
        <Icon name="player-skip-forward" />
      </Button>
    </div>
    <div class="content" data-tauri-drag-region>
      <div class="title" data-tauri-drag-region>
        {$playerStore.track?.title || ''}
      </div>
      <div class="artists" data-tauri-drag-region>
        {#each $playerStore.track?.artists || [] as artist, index}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <span
            class="artist"
            on:click={() =>
              modalStore.openModal(ArtistSide, {
                isSidebar: true,
                props: { artist },
              })}
            >{artist.name}
            {#if index < $playerStore.track?.artists.length - 1}
              ,
            {/if}
          </span>
        {/each}
      </div>
    </div>
    <div class="right">
      <div class="right-controls">
        <div class="shuffle-btn" class:active={$playerStore.isShuffle}>
          <Button
            mode="outlined"
            on:click={() => playerStore.setShuffle(!$playerStore.isShuffle)}
          >
            <Icon name="arrows-shuffle" />
          </Button>
        </div>
        <LikeBtn
          active={$playlistStore.likedTracks.some(
            (track) => track.id === $playerStore.track?.id
          )}
          on:click={() => {
            playlistStore.likeTrack($playerStore.track);
          }}
        />
      </div>
      <div class="time">
        {getTime(currentDuration)} / {getTime(totalDuration)}
      </div>
    </div>
    <audio controls bind:this={audioEl} />
    <div class="position">
      <div class="buffering" style:width={`${buffering * 100}%`} />
      <Slider
        disabled={totalDuration === 0}
        position={trackPosition < buffering ? trackPosition : buffering}
        on:change={({ detail }) => setPosition(detail)}
      />
    </div>
  </div>
</ContextMenu>

<style>
  audio {
    display: none;
  }

  .cover {
    width: 45px;
    height: 45px;
  }

  .shuffle-btn :global(button) {
    padding: 4px;
    height: auto;
    background-color: transparent;
    position: relative;
    --button-color: var(--base-text);
    opacity: 0.7;
  }
  .shuffle-btn :global(button::before) {
    content: '';
    --size: 4px;
    position: absolute;
    height: var(--size);
    width: var(--size);
    border-radius: var(--size);
    background-color: var(--base-primary);
    bottom: 0px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
  }
  .shuffle-btn.active :global(button) {
    --button-color: var(--base-primary);
    opacity: 1;
  }

  .shuffle-btn.active :global(button::before) {
    opacity: 1;
  }

  .wrapper {
    border-bottom: 1px solid var(--base-border);
    display: flex;
    align-items: center;
    padding: 0;
    position: relative;
    padding: 0 8px;
    padding-bottom: 7px;
    backdrop-filter: blur(9px);
    -webkit-backdrop-filter: blur(9px);
    z-index: 100;
  }

  .position {
    position: absolute;
    bottom: 5px;
    left: 0;
    width: 100%;
    z-index: 200;
    backdrop-filter: blur(9px);
    -webkit-backdrop-filter: blur(9px);
  }

  .buffering {
    height: 5px;
    background-color: var(--base-primary);
    opacity: 0.3;
    position: absolute;
    transition: 0.1s ease-in width;
    left: 0;
    top: 0;
    z-index: 1;
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

  .right-controls {
    display: flex;
    align-items: center;
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

  .artist {
    cursor: pointer;
  }
</style>
