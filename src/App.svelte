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

  onMount(() => {
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
