import { get, writable } from "svelte/store";
import type { Track } from "../models/types";
import { EventEmitter } from "./EventEmitter";

const DEFAULT = {
  track: null as Track | null,
  isShuffle: false,
  originalQueue: [] as Track[],
  queue: [] as Track[],
  params: {} as PlayParams,
  miniMode: false,
  alwaysOnTop: false,
};

type PlayParams = {
  isRadio: boolean;
  noShuffle: boolean
};

const shuffleArray = <T extends unknown>(arr: T[], activeItem?: T): T[] => {
  let currentItem = activeItem || arr[0]
  let array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  [array[array.indexOf(currentItem)], array[0]] = [array[0], array[array.indexOf(currentItem)]];
  return array;
}

const store = writable(DEFAULT);

export const playerStore = {
  subscribe: store.subscribe,
  channel: new EventEmitter(),
  setShuffle(shuffle: boolean) {
    store.update((state) => {
      state.queue = shuffle ? shuffleArray(state.originalQueue, state.track) : [...state.originalQueue];
      state.isShuffle = shuffle;
      return state
    })
  },
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
    const _queue = queue || [];
    store.update((state) => {
      state.track = track;
      state.originalQueue = _queue;
      state.queue = state.isShuffle && !params?.noShuffle ? shuffleArray(_queue, state.track) : _queue;
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          state.params[key] = value;
        });
      }
      return state;
    });
  },
};
