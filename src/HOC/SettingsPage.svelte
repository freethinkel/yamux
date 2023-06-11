<script lang="ts">
  import { settingsStore } from '../store/settings';

  import ColorPicker from '../components/ColorPicker.svelte';
  import { onMount } from 'svelte';
  import * as t from '@tauri-apps/api';

  let version = '';

  onMount(async () => {
    version = await t.app.getVersion();
  });
</script>

<div class="wrapper">
  <h1>
    Настройки
    <div class="about">
      v{version}
    </div>
  </h1>

  <div class="theme">
    <h4>Тема</h4>
    <ColorPicker
      color={$settingsStore.theme.primaryColor}
      on:change={({ detail }) => {
        settingsStore.changePrimaryColor(detail);
      }}
    />
  </div>
</div>

<style>
  h1 {
    display: flex;
    align-items: flex-end;
  }
  h1 .about {
    font-size: 1rem;
    color: var(--base-text);
    margin-left: 10px;
    margin-bottom: 12px;
  }
  h4 {
    margin-bottom: 10px;
  }
  .wrapper {
    padding: 0 12px;
  }
  .theme {
    margin-top: 24px;
  }
</style>
