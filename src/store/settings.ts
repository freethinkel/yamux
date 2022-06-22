import { StorageService } from '../services/storage.service';
import { writable } from 'svelte/store';

const DEFAULT = {
	theme: {
		primaryColor: 'rgba(235, 168, 102, 1)',
	},
};

const store = writable<typeof DEFAULT>(
	StorageService.getItem('settings') || DEFAULT
);

store.subscribe((state) => {
	StorageService.setItem('settings', state);
});

export const settingsStore = {
	subscribe: store.subscribe,
	changePrimaryColor(color: string) {
		store.update((state) => {
			state.theme.primaryColor = color;
			return state;
		});
	},
};
