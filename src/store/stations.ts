import { ApiService } from "../services/api.service";
import { get, writable } from "svelte/store";
import type { Station } from "../models/station";
import { playerStore } from "./player";
import { delay, getStationId } from "../helpers";
import type { Track } from "../models/types";

const DEFAULT = {
  stations: [] as Station[],
  currentStation: null as Station | null,
  pending: true,
  batchId: null as string | null,
};

const store = writable(DEFAULT);

let lastTrack: Track | null = null;

playerStore.subscribe((state) => {
  if (state.params.isRadio) {
    const isLast =
      state.queue.indexOf(state.track) === 0 &&
      state.queue.indexOf(lastTrack) === state.queue.length - 1;
    if (isLast) {
      stationsStore.playStation(
        get(store).currentStation,
        state.queue[state.queue.length - 1]
      );
    }
    lastTrack = state.track;
  }
});

export const stationsStore = {
  subscribe: store.subscribe,
  update: store.update,
  set: store.set,
  async loadStations() {
    const res = await ApiService.getStations();

    store.update((state) => {
      state.stations = res.data.result.stations;
      state.pending = false;
      return state;
    });
  },
  async playStation(station: Station, beforeTrack?: Track) {
    store.update((state) => {
      state.currentStation = station;
      return state;
    });
    playerStore.setTrack(null);
    const trackId = beforeTrack?.id;
    const res = await ApiService.getStationTracks(getStationId(station), {
      queueTrackId: trackId,
    });

    const batchId = res.data.result.batchId;
    const tracks = res.data.result.sequence.map((seq) => seq.track);

    const firstTrack = tracks[0];
    playerStore.setTrack(firstTrack, tracks, { isRadio: true });

    store.update((state) => {
      state.batchId = batchId;
      return state;
    });
    stationsStore.stationStarted(station);
  },

  async stationStarted(station: Station) {
    const batchId = get(store).batchId;
    await ApiService.sendStationFeedbackRadioStarted(getStationId(station), {
      batchId,
    });
  },

  async stationTrackStarted(track: Track) {
    const { batchId, currentStation } = get(store);

    await ApiService.sendStationFeedbackTrackStarted(
      getStationId(currentStation),
      {
        batchId,
        trackId: track.id,
      }
    );
  },
  async stationTrackFinished(track: Track) {
    const { batchId, currentStation } = get(store);
    await ApiService.sendStationFeedbackTrackFinished(
      getStationId(currentStation),
      {
        batchId,
        trackId: track.id,
      }
    );
  },
  async stationSkip(track: Track, seconds: number) {
    const { batchId, currentStation } = get(store);
    await stationsStore.stationTrackFinished(track);
    await ApiService.sendStationFeedbackSkip(getStationId(currentStation), {
      batchId,
      trackId: track.id,
      totalPlayedSeconds: seconds,
    });
  },
};
