<script lang="ts">
  import { onMount } from "svelte";
  import { authStore } from "./store/auth";

  import Modal from "./HOC/Modal.svelte";
  import { modalStore } from "./store/modal";
  import AuthModal from "./HOC/AuthModal.svelte";
  import Main from "./HOC/Main.svelte";
  import { playlistStore } from "./store/playlist";
  import { homeStore } from "./store/home";
  import { stationsStore } from "./store/stations";
  import { playerStore } from "./store/player";
  import { settingsStore } from "./store/settings";
  import { get } from "svelte/store";

  const generateStyle = (color: string) => {
    return `
      :root {
        --base-primary: ${color};
      }
    `;
  };

  onMount(() => {
    const settingsStyle = document.createElement("style");
    settingsStyle.innerHTML = generateStyle(get(settingsStore).color);
    document.head.appendChild(settingsStyle);
    settingsStore.subscribe((state) => {
      settingsStyle.innerHTML = generateStyle(state.color);
    });
    if (!$authStore.token) {
      modalStore.openModal(AuthModal, { noClose: true });
    } else {
      playlistStore.getPlaylists();
      playlistStore.getLikedTracks();
      homeStore.getData();
      stationsStore.loadStations();

      window.addEventListener("keydown", (event) => {
        if (
          (event.target as HTMLBodyElement).tagName.toLowerCase() === "body"
        ) {
          if (event.code.toLowerCase() === "space") {
            event.preventDefault();
            playerStore.channel.emit("toggle", undefined);
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
