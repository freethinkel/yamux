import { writable } from "svelte/store";

const DEFAULT = {
  component: null,
  isSidebar: false,
  noClose: false,
  props: {},
};

const store = writable({ ...DEFAULT });

export const modalStore = {
  subscribe: store.subscribe,
  set: store.set,
  closeModal() {
    store.set({ ...DEFAULT });
  },
  openModal(
    component: any,
    options?: Partial<Omit<typeof DEFAULT, "component">>
  ) {
    store.update((state) => {
      state.component = component;
      if (options) {
        Object.entries(options).forEach(([key, value]) => {
          state[key] = value;
        });
      }
      return state;
    });
  },
};
