<script>
  import { playerStore } from '../store/player';

  import TrackList from './TrackList.svelte';
</script>

<div class="wrapper">
  <h3 class="title">Очередь воспроизведения</h3>

  <TrackList queueList tracks={$playerStore.queue} />
</div>

<style>
  .wrapper {
    padding: 12px 8px 0;
    background-color: var(--base-panel);
    -webkit-backdrop-filter: blur(9px);
    backdrop-filter: blur(9px);
    border-left: 12px;
    height: 100vh;
    width: 400px;
    display: flex;
    flex-direction: column;
  }
  .title {
    font-size: 2rem;
  }
</style>
