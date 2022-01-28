import { get, writable } from "svelte/store";
import { ApiService, httpRust } from "../services/api.service";
import { StorageService } from "../services/storage.service";

const DEFAULT = {
  token: null as null | string,
  userName: null as null | string,
  userId: null as null | number,
};

const store = writable(
  (StorageService.getItem("authStore") as typeof DEFAULT) || DEFAULT
);

store.subscribe((data) => {
  httpRust.setHeaders({
    Authorization: `OAuth ${data.token}`,
  });

  StorageService.setItem("authStore", data);
});

export const authStore = {
  subscribe: store.subscribe,
  set: store.set,
  async login(login: string, password: string) {
    const res = await ApiService.auth(login, password);
    store.update((state) => {
      state.token = res.data.access_token;
      state.userId = res.data.uid;
      state.userName = login;
      return state;
    });
  },
  setToken(token: string) {
    store.update((state) => {
      state.token = token;

      return state;
    });
  },
};

export const getUserId = () => get(authStore).userId;

export const isAutorized = (): boolean => !!get(authStore).token;
