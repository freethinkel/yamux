<script lang="ts">
  import ContextMenu from './ContextMenu.svelte';
  import Button from './Button.svelte';
  import Icon from './Icon.svelte';
  import { fade } from 'svelte/transition';
  import { createEventDispatcher } from 'svelte';
  export let active = false;
  export let name = '';
  let renameValue = name;
  let isRename = false;

  $: {
    renameValue = name;
  }

  const options = [
    {
      id: 'rename',
      icon: 'pencil',
      label: 'Переименовать',
    },
    {
      id: 'delete',
      icon: 'trash',
      label: 'Удалить',
    },
  ];

  const onContextMenu = (event: string) => {
    if (event === 'rename') {
      isRename = true;
    } else if (event === 'delete') {
      dispatch('delete');
    }
  };

  const rename = () => {
    isRename = false;
    if (renameValue !== name && renameValue) {
      dispatch('rename', renameValue);
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Enter') {
      (event.target as HTMLInputElement).blur();
    }
  };

  const dispatch = createEventDispatcher();
</script>

<div class="playlist__btn" class:active>
  <ContextMenu
    {options}
    on:select={({ detail }) => !isRename && onContextMenu(detail)}
  >
    {#if isRename}
      <!-- svelte-ignore a11y-autofocus -->
      <input
        bind:value={renameValue}
        autofocus
        type="text"
        on:keydown={onKeyDown}
        on:blur={() => rename()}
      />
    {:else}
      <Button mode="outlined" on:click={() => dispatch('click')}>
        <Icon name="playlist" />
        <div class="text">
          {name}
        </div>
      </Button>
    {/if}
  </ContextMenu>
</div>

<style>
  input {
    background: var(--base-overlay);
    appearance: none;
    border-radius: var(--border-radius);
    border: none;
    height: 32px;
    color: var(--base-title);
    font-size: 1rem;
    padding: 0 8px;
    outline: none;
    width: 100%;
  }
  .playlist__btn {
    --button-color: var(--base-title);
    --button-bg-color: transparent;
  }
  .playlist__btn :global(.icon) {
    color: var(--base-primary);
  }

  .playlist__btn.active {
    --button-bg-color: var(--base-overlay);
  }
  .text {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
