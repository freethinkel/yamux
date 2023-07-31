import { get, writable } from 'svelte/store';
import { ApiService, httpRust } from '../services/api.service';
import { StorageService } from '../services/storage.service';

const DEFAULT = {
  token: null as null | string,
  userName: null as null | string,
  userId: null as null | number,
};

const store = writable(
  (StorageService.getItem('authStore') as typeof DEFAULT) || { ...DEFAULT }
);

store.subscribe((data) => {
  httpRust.setHeaders({
    Authorization: `OAuth ${data.token}`,
  });

  StorageService.setItem('authStore', data);
});

export const authStore = {
  subscribe: store.subscribe,
  set: store.set,
  async login() {
    const res: any = await ApiService.auth().catch(console.log);
    httpRust.setHeaders({
      Authorization: `OAuth ${res.data.access_token}`,
    });
    const resUser: any = await ApiService.getAccountStatus().catch(console.log);
    store.update((state) => {
      state.token = res.data.access_token;
      state.userId = resUser.data.result.account.uid;
      state.userName = resUser.data.result.account.login;
      return state;
    });

    return res;
  },
  logout() {
    localStorage.clear();
    store.set({ ...DEFAULT });
    window.location.reload();
  },
  setToken(token: string) {
    store.update((state) => {
      state.token = token;

      return state;
    });
  },
};

export const getUserId = () => get(authStore).userId;

export const isAuthorized = (): boolean => !!get(authStore).token;
