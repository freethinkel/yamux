import { get, writable } from "svelte/store";
import type { Track } from "../models/types";
import { EventEmitter } from "./EventEmitter";

const DEFAULT = {
  track: null as Track | null,
  queue: [] as Track[],
  params: {} as PlayParams,
  miniMode: false,
  alwaysOnTop: false,
};

type PlayParams = {
  isRadio: boolean;
};

const store = writable(DEFAULT);

export const playerStore = {
  subscribe: store.subscribe,
  channel: new EventEmitter(),
  forwardQueue() {
    store.update((state) => {
      const index = state.queue.indexOf(state.track);
      const newTrack = state.queue[(index + 1) % state.queue.length];

      state.track = newTrack;
      return state;
    });
  },
  backwardQueue() {
    store.update((state) => {
      const index = state.queue.indexOf(state.track);
      const newTrack =
        state.queue[index == 0 ? state.queue.length - 1 : index - 1];

      state.track = newTrack;
      return state;
    });
  },
  setTrack(track: Track, queue?: Track[], params?: Partial<PlayParams>) {
    store.update((state) => {
      state.track = track;
      state.queue = queue || [];
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          state.params[key] = value;
        });
      }
      return state;
    });
  },
};
