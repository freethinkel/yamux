import { get, writable } from "svelte/store";
import type { PlayList } from "../models/playlist";
import type { Track } from "../models/types";
import { ApiService } from "../services/api.service";

const DEFAULT = {
  playlists: [] as PlayList[],
  likeds: [] as Track[],
};

const store = writable(DEFAULT);

export const playlistStore = {
  subscribe: store.subscribe,
  set: store.set,
  async getLikedTracks() {
    const res = await ApiService.getLikedTracks();
    console.log(res);
    store.update((state) => {
      state.likeds = res.result;
      return state;
    });
  },
  async getTracks(kind: number) {
    const playlists = get(store).playlists;
    const currentPlaylsit = playlists.find((p) => p.kind === kind);
    if (!currentPlaylsit.tracks) {
      const res = await ApiService.getPlaylistInfo(kind);
      store.update((state) => {
        state.playlists = state.playlists.map((p) =>
          p.kind === kind ? res.data.result : p
        );

        return state;
      });
    }
  },
  async getPlaylists() {
    const res = await ApiService.getUsersPlaylists();
    console.log(res.data.result);
    store.update((state) => {
      state.playlists = res.data.result;
      return state;
    });
  },
};
