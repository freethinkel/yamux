<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { platform } from '@tauri-apps/api/os';
  import DraggableWindow from '../components/DraggableWindow.svelte';
  import Button from '../components/Button.svelte';
  import Icon from '../components/Icon.svelte';
  import { authStore } from '../store/auth';
  import { playlistStore } from '../store/playlist';
  import PlaylistButton from '../components/PlaylistButton.svelte';

  export let selectedPage: string;
  let isMacos = false;
  let isCreate = false;
  let createPlaylistValue = '';

  const dispatch = createEventDispatcher();

  const setPage = (id: string) => {
    dispatch('setPage', id);
  };

  onMount(async () => {
    isMacos = (await platform()) === 'darwin';
  });

  const createInputKeydown = (event: KeyboardEvent) => {
    if (event.code === 'Enter') {
      (event.target as HTMLInputElement).blur();
    }
  };
  const onCreatePlaylist = () => {
    isCreate = false;
    if (createPlaylistValue) {
      playlistStore.createPlaylist(createPlaylistValue);
    }
  };

  const setCreatePlayslitMode = () => {
    createPlaylistValue = '';
    isCreate = true;
  };
</script>

<nav class="wrapper">
  {#if isMacos}
    <DraggableWindow style="height: 40px;min-height: 40px;" />
  {/if}
  <div class="links">
    <ul>
      <li>
        <div class="basic__btn" class:active={selectedPage === 'home'}>
          <Button mode="outlined" on:click={() => setPage('home')}>
            <Icon name="home" />
            Главная
          </Button>
        </div>
      </li>
      <li>
        <div class="basic__btn" class:active={selectedPage === 'radio'}>
          <Button mode="outlined" on:click={() => setPage('radio')}>
            <Icon name="radio" />
            Радио
          </Button>
        </div>
      </li>
      <li>
        <div class="liked__btn" class:active={selectedPage === 'liked'}>
          <Button mode="outlined" on:click={() => setPage('liked')}>
            <Icon name="heart" />
            Мне нравится
          </Button>
        </div>
      </li>
      <li>
        <div class="basic__btn" class:active={selectedPage === 'search'}>
          <Button mode="outlined" on:click={() => setPage('search')}>
            <Icon name="search" />
            Поиск
          </Button>
        </div>
      </li>
    </ul>
    <div class="playlists">
      <div class="playlist__header">
        <h4>Плейлисты</h4>
        <button class="playlist__add-btn" on:click={setCreatePlayslitMode}>
          <Icon name="plus" />
        </button>
      </div>
      <ul>
        {#if isCreate}
          <li>
            <input
              class="create-playlist-input"
              type="text"
              bind:value={createPlaylistValue}
              autofocus
              on:keydown={createInputKeydown}
              on:blur={onCreatePlaylist}
            />
          </li>
        {/if}
        {#each $playlistStore.playlists as playlist}
          <li>
            <PlaylistButton
              name={playlist.title}
              active={playlist.kind.toString() === selectedPage}
              on:rename={({ detail }) =>
                playlistStore.renamePlaylist(playlist.kind, detail)}
              on:delete={() =>
                setTimeout(() => playlistStore.removePlaylist(playlist.kind))}
              on:click={() => setPage(playlist.kind.toString())}
            />
          </li>
        {/each}
      </ul>
    </div>
  </div>
  <div class="profile">
    {#if $authStore.userName}
      <Button
        size="small"
        mode={selectedPage === 'settings' ? 'raised' : 'outlined'}
        on:click={() => setPage('settings')}
      >
        <Icon name="user" />
        <div class="profile__name">{$authStore.userName}</div>
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
  .playlists :global(button) {
    text-align: left;
  }
  .playlist__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .create-playlist-input {
    border-radius: var(--border-radius);
    border: none;
    height: 32px;
    padding: 0 8px;
    font-size: 1rem;
    color: var(--base-title);
    background: var(--base-overlay);
    width: 100%;
    outline: none;
  }
  .playlist__add-btn {
    border: none;
    height: 24px;
    padding: 0;
    background: none;
    appearance: none;
    outline: none;
    color: var(--base-title);
    cursor: pointer;
  }
  .playlist__add-btn :global(.icon) {
    font-size: 18px;
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
  .basic__btn {
    --button-color: var(--base-title);
    --button-bg-color: transparent;
  }
  .basic__btn :global(.icon) {
    color: var(--base-primary);
  }

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
  .profile :global(button) {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .profile__name {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .logout__btn {
    --button-color: var(--base-red);
  }
</style>
