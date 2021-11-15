<script lang="ts">
  import { createEventDispatcher } from "svelte";

  import Button from "../components/Button.svelte";
  import Icon from "../components/Icon.svelte";
  import { authStore } from "../store/auth";
  import { playlistStore } from "../store/playlist";

  export let selectedPage: string;

  const dispatch = createEventDispatcher();

  const setPage = (id: string) => {
    dispatch("setPage", id);
  };
</script>

<nav class="wrapper">
  <div class="links">
    <ul>
      <li>
        <div class="homepage__btn" class:active={selectedPage === "home"}>
          <Button mode="outlined" on:click={() => setPage("home")}>
            <Icon name="home" />
            Главная
          </Button>
        </div>
      </li>
      <li class="liked__btn">
        <div class="liked__btn" class:active={selectedPage === "liked"}>
          <Button mode="outlined" on:click={() => setPage("liked")}>
            <Icon name="heart" />
            Мне нравится
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
    <Button size="small" mode="outlined">
      <Icon name="user" />
      {$authStore.userName}
    </Button>
    <div class="logout__btn">
      <Button mode="outlined" size="small">
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
    /* justify-content: center; */
  }
  .liked__btn {
    --button-color: var(--color-red);
    --button-bg-color: var(--color-red12);
  }
  li + li {
    margin-top: 12px;
  }
  .liked__btn.active {
    --button-color: var(--color-white);
    --button-bg-color: var(--color-red);
  }
  .playlist__btn.active,
  .homepage__btn.active {
    --button-color: var(--color-white);
    --button-bg-color: var(--color-primary);
  }
  .profile {
    display: flex;
    justify-content: space-between;
    padding: 12px 8px;
    --button-padding: 18px 6px;
    --button-gap: 6px;
  }
  .logout__btn {
    --button-color: var(--color-red);
    --button-bg-color: var(--color-red12);
  }
</style>
