import { writable } from "svelte/store";
import type { LandingBlock } from "../models/landing";
import type { Track } from "../models/types";
import { ApiService } from "../services/api.service";

const DEFAULT = {
  blocks: [] as LandingBlock[],
  cachedEntities: {} as Record<number, Track[]>,
};

const store = writable(DEFAULT);

export const homeStore = {
  subscribe: store.subscribe,
  set: store.set,
  async getData() {
    const res = await ApiService.getHomeData();
    store.update((state) => {
      state.blocks = res.data.result.blocks;

      return state;
    });
  },
};
