<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from './store/auth';
  import Modal from './HOC/Modal.svelte';
  import { modalStore } from './store/modal';
  import AuthModal from './HOC/AuthModal.svelte';
  import Main from './HOC/Main.svelte';
  import { playlistStore } from './store/playlist';
  import { homeStore } from './store/home';
  import { stationsStore } from './store/stations';
  import { playerStore } from './store/player';
  import { settingsStore } from './store/settings';
  import { get } from 'svelte/store';
  import { rgba } from 'polished';
  import { platform } from '@tauri-apps/api/os';

  const generateStyle = (color: string) => {
    return `
      :root {
        --base-primary: ${color};
        --base-primary12: ${rgba(color, 0.12)};
      }
    `;
  };

  onMount(() => {
    platform().then((platform) => {
      if (platform !== 'darwin') {
        document.body.style.background = 'var(--base-background)';
      }
    });

    const settingsStyle = document.createElement('style');
    settingsStyle.innerHTML = generateStyle(
      get(settingsStore).theme.primaryColor
    );
    document.head.appendChild(settingsStyle);
    settingsStore.subscribe((state) => {
      settingsStyle.innerHTML = generateStyle(state.theme.primaryColor);
    });
    if (!$authStore.token) {
      modalStore.openModal(AuthModal, { noClose: true });
    } else {
      playlistStore.getPlaylists();
      playlistStore.getLikedTracks();
      homeStore.getData();
      stationsStore.loadStations();

      window.addEventListener('keydown', (event) => {
        if (
          (event.target as HTMLBodyElement).tagName.toLowerCase() === 'body'
        ) {
          if (event.code.toLowerCase() === 'space') {
            event.preventDefault();
            playerStore.channel.emit('toggle', undefined);
          } else if (event.code.toLowerCase() === 'keyl') {
            event.preventDefault();
            playerStore.forwardQueue();
          } else if (event.code.toLowerCase() === 'keyh') {
            event.preventDefault();
            playerStore.forwardQueue();
          }
        }
      });
    }
  });
</script>

<main>
  <Main />
</main>
<Modal />
