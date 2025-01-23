import { ref } from "vue";
import serverClient from '../clients/serverClient';
import { currentServer } from '@/store/currentServer';
import libraries, { setLibraries } from '@/store/Libraries';

import type { LibrariesResponse } from '@/types/api/base/library';
import { setupComplete } from '@/store/ui';
import router from "@/router";

const done = ref(false);

const getLibraries = (): Promise<void> => new Promise((resolve, reject) => {

	if (libraries.value.length > 0 || done.value) {
		resolve();
		return;
	}

	if (!currentServer.value) {
		resolve();
		return;
	}

	serverClient()
		.get<{ data: LibrariesResponse[] }>('/libraries')
		.then(({ data }) => {
			setLibraries(data.data);
			setupComplete.value = true;
			resolve();
		})
		.catch((error) => {
			done.value = true;
			router.push({ name: 'Server offline' }).then(() => resolve());
			// resolve();
		});
});

export default getLibraries;
