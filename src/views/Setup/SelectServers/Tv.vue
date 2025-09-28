<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { IonContent, IonPage, onIonViewWillEnter } from '@ionic/vue';
import { useQueryClient } from '@tanstack/vue-query';

import type { LibrariesResponse } from '@/types/api/base/library';
import type { Server } from '@/types/auth.ts';

import router from '@/router';
import serverClient from '@/lib/clients/serverClient.ts';
import servers, { serverLibraries } from '@/store/servers';
import { hideNavBar, setupComplete, showNavBar } from '@/store/ui';
import { isTv, tvModeOverride } from '@/config/global';
import { redirectUrl } from '@/store/routeState';
import { setLibraries } from '@/store/Libraries.ts';
import { user } from '@/store/user';
import { setCurrentServer } from '@/store/currentServer.ts';

import ServerCard from '@/views/Setup/SelectServers/components/ServerCard.vue';
import NoMercyAvatar from '@/components/Images/NoMercyAvatar.vue';
import { videoSocketConnection } from '@/store/videoSocket.ts';
import { musicSocketConnection } from '@/store/musicSocket.ts';
import { ripperSocketConnection } from '@/lib/clients/ripperSocket.ts';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const query = useQueryClient();

const serverList = ref<HTMLElement>();

async function handleSelectServer(server: Server) {
	setCurrentServer(server);

	await serverClient()
		.get<{ data: LibrariesResponse[] }>('libraries')
		.then(({ data }) => {
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
			}, 50);
		})
		.catch(async () => {
			await router.replace({ name: 'Server offline' });
		});
}

onMounted(() => {
	setCurrentServer(null);
	hideNavBar();

	query.removeQueries();

	videoSocketConnection.value?.stop();
	musicSocketConnection.value?.stop();
	ripperSocketConnection.value?.stop();
});

onUnmounted(() => {
	showNavBar();
});

onIonViewWillEnter(() => {
	setTimeout(() => {
		serverList.value?.querySelector('button')?.focus();
	}, 100);
});

watch(serverList, (value) => {
	setTimeout(() => {
		value?.querySelector('button')?.focus();
	}, 100);
});
</script>

<template>
	<IonPage>
		<IonContent :fullscreen="true">
			<div
				class="flex h-full w-full flex-auto flex-col items-center justify-center gap-8 p-8"
			>
				<!--        <EmptyBackdrop /> -->

				<div
					class="flex w-full flex-grow flex-col justify-between p-2 min-h-auto"
				>
					<div
						class="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 w-full relative gap-2.5 mb-2"
					>
						<div class="flex justify-start items-center relative gap-2.5" inert>
							<div class="size-12 my-auto">
								<NoMercyAvatar :size="40" :user="user" />
							</div>
							<p
								class="w-48 text-base font-semibold text-left "
							>
								{{ user.name }}
							</p>
						</div>

						<button
							v-show="!isTv"
							class="flex justify-center items-center ml-auto relative gap-1.5 pl-3 pr-4 py-2.5 h-10 opacity-40 rounded-full border-[1.5px] border-[#c4c7c5]"
							tabindex="0"
							@click="tvModeOverride = !tvModeOverride"
						>
							<MoooomIcon
								class=""
								icon="doorOut"
							/>
							<span
								class="flex-grow-0 flex-shrink-0 opacity-80 text-sm font-medium text-center text-[#e3e3e3]"
							>
								{{ $t("Exit TV mode") }}
							</span>
						</button>

						<RouterLink
							class="flex justify-center items-center relative gap-1.5 pl-3 pr-4 py-2.5 h-10 opacity-40 rounded-full border-[1.5px] border-[#c4c7c5]"
							to="/logout"
						>
							<MoooomIcon
								class=""
								icon="doorOut"
							/>
							<span
								class="flex-grow-0 flex-shrink-0 opacity-80 text-sm font-medium text-center text-[#e3e3e3]"
							>
								{{ $t("Logout") }}
							</span>
						</RouterLink>
					</div>

					<div
						ref="serverList"
						class="tv:children:w-[30%] tv:mt-0 -mt-24 flex children:h-fit w-full flex-auto flex-wrap content-center justify-center gap-2 children:w-[47%] sm:children:w-[22%] sm:gap-4"
					>
						<template v-for="server in servers" :key="server.id">
							<ServerCard
								:onclick="() => handleSelectServer(server)"
								:server="server"
							/>
						</template>
					</div>
				</div>
			</div>
		</IonContent>
	</IonPage>
</template>
