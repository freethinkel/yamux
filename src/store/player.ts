import { writable } from "svelte/store";
import type { Track } from "../models/types";

const DEFAULT = {
  track: null as Track | null,
  queue: [] as Track[],
};

const store = writable(DEFAULT);

export const playerStore = {
  subscribe: store.subscribe,
  set: store.set,
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
  setTrack(track: Track, queue?: Track[]) {
    store.update((state) => {
      state.track = track;
      state.queue = queue || state.queue;
      return state;
    });
  },
};
