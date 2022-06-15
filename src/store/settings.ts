import { StorageService } from "../services/storage.service";
import { writable } from "svelte/store";

const DEFAULT = {
  color: "rgba(235, 168, 102, 1)",
};

const store = writable(StorageService.getItem("settings") || DEFAULT);

store.subscribe((state) => {
  StorageService.setItem("settings", state);
});

export const settingsStore = {
  set: store.set,
  subscribe: store.subscribe,
  setColor(color: string) {
    store.update((state) => {
      state.color = color;
      return state;
    });
  },
};
