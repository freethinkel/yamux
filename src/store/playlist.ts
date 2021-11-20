import { derived, get, Readable, writable } from "svelte/store";
import type { PlayList } from "../models/playlist";
import type { Track } from "../models/types";
import { ApiService } from "../services/api.service";

const DEFAULT = {
  cached: {} as Record<number, Track[]>,
  playlists: [] as PlayList[],
  likeds: [] as Track[],
};

const store = writable(DEFAULT);

export const playlistStore = {
  subscribe: store.subscribe,
  set: store.set,
  isLiked(track: Track, likeds: Track[]) {
    return likeds.some((t) => t.id === track.id);
  },
  async likeTrack(track: Track) {
    try {
      let isRemove = playlistStore.isLiked(track, get(store).likeds);
      const res = await ApiService.likeAction("track", [track.id], isRemove);
      console.log(res);
      store.update((state) => {
        if (isRemove) {
          state.likeds = state.likeds.filter((t) => t.id !== track.id);
        } else {
          state.likeds = [track, ...state.likeds];
        }
        return state;
      });
    } catch (err) {
      console.error(err);
    } finally {
    }
  },
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
