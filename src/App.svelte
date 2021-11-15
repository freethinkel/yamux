<script lang="ts">
  import { onMount } from "svelte";
  import { authStore } from "./store/auth";

  import Modal from "./HOC/Modal.svelte";
  import { modalStore } from "./store/modal";
  import AuthModal from "./HOC/AuthModal.svelte";
  import Main from "./HOC/Main.svelte";
  import { playlistStore } from "./store/playlist";

  onMount(() => {
    if (!$authStore.token) {
      modalStore.openModal(AuthModal);
    } else {
      playlistStore.getPlaylists();
    }
  });
</script>

<main>
  <Main />
</main>
<Modal />
