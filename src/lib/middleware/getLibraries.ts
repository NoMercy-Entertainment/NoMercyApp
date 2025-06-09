import { ref } from "vue";
import serverClient from '../clients/serverClient';
import { currentServer } from '@/store/currentServer';
import libraries, { setLibraries } from '@/store/Libraries';

import type { LibrariesResponse } from '@/types/api/base/library';
import { setupComplete } from '@/store/ui';
import router from "@/router";
import {redirectUrl} from "@/store/routeState";
import {useRoute} from "vue-router";

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

	const route = useRoute();
	redirectUrl.value = route?.fullPath ?? location.pathname;

	serverClient()
		.get<{ data: LibrariesResponse[] }>('libraries')
		.then(({ data }) => {
			setLibraries(data.data);
			setupComplete.value = true;

			resolve();
		})
		.catch(() => {
			done.value = true;
			router.push({ name: 'Server offline' }).then(() => resolve());
		});
});

export default getLibraries;
