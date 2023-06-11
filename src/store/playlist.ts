import { get, writable } from 'svelte/store';
import type { PlayList } from '../models/playlist';
import type { Track } from '../models/types';
import { ApiService } from '../services/api.service';

const DEFAULT = {
  cached: {} as Record<number, Track[]>,
  playlists: [] as PlayList[],
  likedTracks: [] as Track[],
};

const store = writable(DEFAULT);

export const playlistStore = {
  subscribe: store.subscribe,
  set: store.set,
  isLiked(track: Track, likedTracks: Track[]) {
    return likedTracks.some((t) => t.id === track.id);
  },
  async addTrack(kind: number, track: Track) {
    const playlist = get(store).playlists.find(
      (playlist) => playlist.kind === kind
    );
    store.update((state) => {
      const playlist = state.playlists.find(
        (playlist) => playlist.kind === kind
      );
      if (!playlist.tracks) {
        playlist.tracks = [];
      }
      playlist.trackCount += 1;
      playlist.tracks.push({
        id: Number(track.id),
        playCount: 0,
        recent: true,
        timestamp: String(Date.now()),
        track,
        originalIndex: 0,
      });
      return state;
    });
    const res = await ApiService.addTrackToPlaylist(
      playlist.kind,
      playlist.revision,
      [{ id: track.id, albumId: String(track.albums[0].id) }]
    );
    store.update((state) => {
      state.playlists = state.playlists.map((playlist) =>
        playlist.kind === kind ? res.data.result : playlist
      );
      return state;
    });
    await this.getTracks(kind);
  },
  async removeTrackFromPlaylist(kind: number, track: Track) {
    const playlist = get(store).playlists.find(
      (playlist) => playlist.kind === kind
    );
    const trackIndex = playlist.tracks.find(
      (trackItem) => trackItem.track.id === track.id
    ).originalIndex;
    playlist.tracks = playlist.tracks.filter(
      (trackItem) => trackItem.track !== track
    );
    playlist.trackCount -= 1;
    store.update((state) => {
      return state;
    });

    await ApiService.removeTrackFromPlaylist(
      kind,
      playlist.revision,
      [{ id: track.id, albumId: String(track.albums[0].id) }],
      {
        from: trackIndex,
        to: trackIndex + 1,
      }
    );
  },
  async likeTrack(track: Track) {
    try {
      let isRemove = playlistStore.isLiked(track, get(store).likedTracks);
      await ApiService.likeAction('track', [track.id], isRemove);
      store.update((state) => {
        if (isRemove) {
          state.likedTracks = state.likedTracks.filter(
            (t) => t.id !== track.id
          );
        } else {
          state.likedTracks = [track, ...state.likedTracks];
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
    store.update((state) => {
      state.likedTracks = res.result;
      return state;
    });
  },
  async getTracks(kind: number) {
    const playlists = get(store).playlists;
    const currentPlaylist = playlists.find((p) => p.kind === kind);
    if (!currentPlaylist.tracks) {
      const res = await ApiService.getPlaylistInfo(kind);
      store.update((state) => {
        state.playlists = state.playlists.map((p) =>
          p.kind === kind ? res.data.result : p
        );

        return state;
      });
    }
  },
  async renamePlaylist(kind: number, name: string) {
    store.update((state) => {
      state.playlists.map((playlist) => {
        if (playlist.kind === kind) {
          playlist.title = name;
        }
        return playlist;
      });
      return state;
    });
    await ApiService.renamePlaylist(kind, name);
  },
  async createPlaylist(name: string) {
    const res = await ApiService.createPlaylist(name);

    store.update((state) => {
      state.playlists.push(res.data.result);
      return state;
    });
  },
  async removePlaylist(kind: number) {
    store.update((state) => {
      state.playlists = state.playlists.filter(
        (playlist) => playlist.kind !== kind
      );
      return state;
    });
    await ApiService.removePlaylist(kind);
  },

  async getPlaylists() {
    const res = await ApiService.getUsersPlaylists();
    store.update((state) => {
      state.playlists = res.data.result;
      return state;
    });
  },
};
