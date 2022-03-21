<script lang="ts">
  import DraggableWindow from "../components/DraggableWindow.svelte";

  import { createEventDispatcher, onMount } from "svelte";

  import Button from "../components/Button.svelte";
  import Icon from "../components/Icon.svelte";
  import { authStore } from "../store/auth";
  import { playlistStore } from "../store/playlist";
  import { platform } from "@tauri-apps/api/os";

  export let selectedPage: string;
  let isMacos = false;

  const dispatch = createEventDispatcher();

  const setPage = (id: string) => {
    dispatch("setPage", id);
  };

  onMount(async () => {
    isMacos = (await platform()) === "darwin";
  });
</script>

<nav class="wrapper">
  {#if isMacos}
    <DraggableWindow style="height: 40px;" />
  {/if}
  <div class="links">
    <ul>
      <li>
        <div class="basic__btn" class:active={selectedPage === "home"}>
          <Button mode="outlined" on:click={() => setPage("home")}>
            <Icon name="home" />
            Главная
          </Button>
        </div>
      </li>
      <li>
        <div class="basic__btn" class:active={selectedPage === "radio"}>
          <Button mode="outlined" on:click={() => setPage("radio")}>
            <Icon name="radio" />
            Радио
          </Button>
        </div>
      </li>
      <li>
        <div class="liked__btn" class:active={selectedPage === "liked"}>
          <Button mode="outlined" on:click={() => setPage("liked")}>
            <Icon name="heart" />
            Мне нравится
          </Button>
        </div>
      </li>
      <li>
        <div class="basic__btn" class:active={selectedPage === "search"}>
          <Button mode="outlined" on:click={() => setPage("search")}>
            <Icon name="search" />
            Поиск
          </Button>
        </div>
      </li>
    </ul>
    <div class="playlists">
      <h4>Плейлисты</h4>
      <ul>
        {#each $playlistStore.playlists as playlist}
          <li>
            <div
              class="playlist__btn"
              class:active={playlist.kind.toString() === selectedPage}
            >
              <Button
                mode="outlined"
                on:click={() => setPage(playlist.kind.toString())}
              >
                <Icon name="playlist" />
                {playlist.title}
              </Button>
            </div>
          </li>
        {/each}
      </ul>
    </div>
  </div>
  <div class="profile">
    {#if $authStore.userName}
      <Button size="small" mode="outlined">
        <Icon name="user" />
        {$authStore.userName}
      </Button>
    {/if}
    <div class="logout__btn">
      <Button mode="outlined" size="small" on:click={() => authStore.logout()}>
        <Icon name="logout" />
      </Button>
    </div>
  </div>
</nav>

<style>
  .wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .playlists {
    margin-top: 12px;
  }

  .links {
    padding: 12px 8px;
    flex-grow: 1;
    overflow: auto;
  }

  h4 {
    font-size: 0.8rem;
    color: var(--base-subtitle);
  }

  ul {
    padding: 0;
    margin: 0;
    flex-grow: 1;
  }
  li {
    margin: 0;
    padding: 0;
    list-style: none;
    width: 100%;
    --button-gap: 10px;
  }
  li :global(button) {
    width: 100%;
  }
  li + li {
    margin-top: 4px;
  }
  .liked__btn {
    --button-color: var(--color-red);
  }
  .liked__btn {
    --button-color: var(--base-title);
    --button-bg-color: transparent;
  }
  .liked__btn :global(.icon) {
    color: var(--base-red);
  }
  .liked__btn.active {
    --button-bg-color: var(--base-overlay);
  }
  .playlist__btn,
  .basic__btn {
    --button-color: var(--base-title);
    --button-bg-color: transparent;
  }
  .playlist__btn :global(.icon),
  .basic__btn :global(.icon) {
    color: var(--base-primary);
  }

  .playlist__btn.active,
  .basic__btn.active {
    --button-bg-color: var(--base-overlay);
  }
  .profile {
    display: flex;
    justify-content: space-between;
    padding: 12px 8px;
    --button-padding: 18px 6px;
    --button-gap: 6px;
  }
  .logout__btn {
    --button-color: var(--base-red);
    --button-bg-color: transparent;
  }
</style>
