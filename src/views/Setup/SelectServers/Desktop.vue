<script setup lang="ts">
import { onMounted } from 'vue';

import { useQueryClient } from '@tanstack/vue-query';

import type { Server } from '@/types/auth';
import type { LibrariesResponse } from '@/types/api/base/library';

import router from '@/router';
import servers, { serverLibraries } from '@/store/servers';
import { setCurrentServer } from '@/store/currentServer';
import { setBackground, setColorPalette, setupComplete } from '@/store/ui';
import { setLibraries } from '@/store/libraries';
import serverClient from '@/lib/clients/serverClient.ts';

import ServerCard from '@/views/Setup/SelectServers/components/ServerCard.vue';

import EmptyBackdrop from '@/components/Images/EmptyBackdrop.vue';
import { redirectUrl } from '@/store/routeState';
import { videoSocketConnection } from '@/store/videoSocket.ts';
import { musicSocketConnection } from '@/store/musicSocket.ts';
import { ripperSocketConnection } from '@/lib/clients/ripperSocket.ts';

const query = useQueryClient();

async function handleSelectServer(server: Server) {
	setCurrentServer(server);

	await serverClient()
		.get<{ data: LibrariesResponse[] }>('libraries')
		.then(async ({ data }) => {
			setLibraries(data.data);
			setupComplete.value = true;
			serverLibraries.value = true;

			setTimeout(async () => {
				if (redirectUrl.value === '/setup/select-servers') {
					await router.replace({ name: 'Home' });
				}
				else {
					await router.replace(redirectUrl.value);
				}
			}, 500);
		})
		.catch(async () => {
			await router.replace({ name: 'Server offline' });
		});
}

onMounted(() => {
	setCurrentServer(null);
	setColorPalette(null);
	setBackground(null);

	query.removeQueries();

	videoSocketConnection.value?.stop();
	musicSocketConnection.value?.stop();
	ripperSocketConnection.value?.stop();
});
</script>

<template>
			<div
				class="flex h-full w-full flex-auto flex-col items-center justify-center gap-8"
			>
				<EmptyBackdrop />

				<div
					class="flex w-full flex-grow flex-col justify-between p-2 min-h-auto"
				>
					<div class="mt-16 mb-4 w-full whitespace-pre-line">
						<h5 class="relative text-center text-lg font-semibold">
							{{ $t("Choose a server") }}
						</h5>
					</div>

					<div
						class="tv:children:w-[30%] tv:mt-0 -mt-24 tv:-ml-8 flex children:h-fit w-full flex-auto flex-wrap content-center justify-center gap-2 children:w-[47%] sm:children:w-[22%] sm:gap-4"
					>
						<template v-for="server in servers" :key="server.id">
							<ServerCard
								:server="server"
								:onclick="() => handleSelectServer(server)"
							/>
						</template>
					</div>
				</div>
			</div>
</template>
