import { writable } from "svelte/store";

const store = writable({
  component: null,
});

export const modalStore = {
  subscribe: store.subscribe,
  set: store.set,
  openModal(component) {
    store.update((state) => {
      state.component = component;
      return state;
    });
  },
};
