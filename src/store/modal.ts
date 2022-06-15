import type { SvelteComponent } from "svelte";
import { writable } from "svelte/store";

type ModalEntry = {
  component: null | typeof SvelteComponent;
  isSidebar: boolean;
  noClose: boolean;
  props: Record<string | number, any>;
};

const store = writable<ModalEntry[]>([]);

export const modalStore = {
  subscribe: store.subscribe,
  set: store.set,
  closeModal() {
    store.update((state) => {
      if (state.length) {
        state.pop();
      }
      return state;
    });
  },
  openModal(
    component: typeof SvelteComponent,
    options?: Partial<Omit<ModalEntry, "component">>
  ) {
    store.update((state) => {
      const entry: ModalEntry = { component } as ModalEntry;
      if (options) {
        Object.entries(options).forEach(([key, value]) => {
          entry[key] = value;
        });
      }

      state.push(entry);
      return state;
    });
  },
};
