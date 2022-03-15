<script lang="ts">
  import { stationsStore } from "../store/stations";
  import StationItem from "../components/StationItem.svelte";
  import type { Station } from "../models/station";
  import { getStationId } from "../helpers";
  import { playerStore } from "../store/player";

  const selectStation = (station: Station) => {
    if (getStationId($stationsStore.currentStation) === getStationId(station)) {
      playerStore.channel.emit("toggle", null);
    } else {
      stationsStore.playStation(station);
    }
  };
</script>

<div class="wrapper">
  <h1>Радио</h1>

  <div class="radio__list">
    {#each $stationsStore.stations as station}
      <div class="radio__item">
        <StationItem
          on:select={() => selectStation(station)}
          name={station.rupTitle}
          isPlaying={station === $stationsStore.currentStation}
          description={station.rupDescription}
          color={station.station.mtsIcon.backgroundColor}
        />
      </div>
    {/each}
  </div>
</div>

<style>
  h1 {
    margin-bottom: 16px;
  }
  .wrapper {
    padding: 0 12px;
  }
  .radio__list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 12px;
  }
</style>
