<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import type { PauseResumeResponse, RunnersResponse, ServerInfo } from '@/types/api/dashboard/server';

import useServerClient from '@/lib/clients/useServerClient';
import serverClient from '@/lib/clients/serverClient';
import { currentServer } from '@/store/currentServer';
import { useVideoSocket } from '@/store/videoSocket';

import KeepCounting from '@/components/KeepCounting.vue';

import ServerSystemCard from './ServerSystemCard.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const isPaused = ref(false);
const isOnline = ref(true);

const { data: runners, refetch } = useQuery({
	queryKey: ['runners', currentServer.value?.serverBaseUrl],
	retryOnMount: true,
	queryFn: () =>
		serverClient()
			.get<RunnersResponse>('dashboard/tasks/runners')
			.then(({ data }) => {
				isPaused.value = !(data.workers > 0);
				return data.workers ?? [];
			}),
});

const { data: serverInfo } = useServerClient<ServerInfo>({
	path: 'dashboard/server/info',
	queryKey: ['serverInfo', currentServer.value?.serverBaseUrl],
});

function connected() {
	isOnline.value = true;
	refetch();
}

function disconnected() {
	isOnline.value = false;
}

onMounted(() => {
	const socket = useVideoSocket();
	socket?.onreconnected(connected);
	socket?.onclose(disconnected);
});

function togglePause() {
	serverClient()
		.post<PauseResumeResponse>(
			`dashboard/tasks/${isPaused.value ? 'resume' : 'pause'}`,
		)
		.then(({ data }) => {
			isPaused.value = !isPaused.value;
			// showNotification({
			//     title: t('Success'),
			//     body: t(isPaused.value
			//         ? 'Paused'
			//         : 'Resumed'),
			//     type: TYPE.SUCCESS,
			// });
			return data;
		})
		.catch((response) => {
			// showNotification({
			//     title: t('Error'),
			//     body: response.data.message,
			//     type: TYPE.ERROR,
			// });
		});
}

function handleSubmit() {
	//
}

function toggleServerState() {
	alert('ok bye!');
}
</script>

<template>
	<ServerSystemCard title="System">
		<template #cta>
			<button
				class="relative h-7 flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2 overflow-hidden border border-solid border-surface-12/11 rounded-lg pl-1 pr-2 py-1 text-surface-12/11"
			>
				<MoooomIcon class="w-4" icon="pause" />
				<p class="flex-shrink-0 flex-grow-0 text-sm">
					{{ $t("Pause") }}
				</p>
			</button>
			<button
				class="relative h-7 flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2 overflow-hidden border border-solid border-surface-12/11 rounded-lg pl-1 pr-2 py-1 text-surface-12/11"
			>
				<MoooomIcon class="w-4" icon="shutdown" />
				<p class="flex-shrink-0 flex-grow-0 text-sm">
					{{ $t("Shutdown") }}
				</p>
			</button>
		</template>

		<div
			class="flex flex-1 flex-nowrap text-sm line-clamp-2 w-available "
		>
			<p
				class="w-40 flex-grow whitespace-nowrap text-sm"
			>
				{{ $t("Server") }}
			</p>
			<p
				class="text-sm line-clamp-2 text-surface-12/11 text-right w-full"
			>
				{{ serverInfo?.server }}
			</p>
		</div>
		<div
			class="flex flex-1 flex-nowrap text-sm line-clamp-2 w-available"
		>
			<p
				class="w-40 flex-grow whitespace-nowrap text-sm"
			>
				{{ $t("Server version") }}
			</p>
			<p
				class="text-sm line-clamp-2 text-surface-12/11 text-right w-full"
			>
				{{ serverInfo?.version }}
			</p>
		</div>
		<div
			class="flex flex-1 flex-nowrap text-sm line-clamp-2 w-available"
		>
			<p
				class="w-40 flex-grow whitespace-nowrap text-sm"
			>
				{{ $t("Uptime") }}
			</p>
			<p
				class="text-sm line-clamp-2 text-surface-12/11 text-right w-full"
			>
				<KeepCounting
					:key="serverInfo?.bootTime"
					:start-time="serverInfo?.bootTime"
				/>
			</p>
		</div>
		<div
			class="flex flex-1 flex-nowrap text-sm line-clamp-2 w-available"
		>
			<p
				class="w-40 flex-grow whitespace-nowrap text-sm"
			>
				{{ $t("OS") }}
			</p>
			<p
				class="text-sm line-clamp-2 text-surface-12/11 text-right w-full"
			>
				{{ serverInfo?.os.toTitleCase() }}
			</p>
		</div>
		<div
			class="flex flex-1 flex-nowrap text-sm line-clamp-2 w-available"
		>
			<p
				class="w-40 flex-grow whitespace-nowrap text-sm"
			>
				{{ $t("Architecture") }}
			</p>
			<p
				class="text-sm line-clamp-2 text-surface-12/11 text-right w-full"
			>
				{{ serverInfo?.arch }}
			</p>
		</div>
		<div
			v-for="(cpu, index) in serverInfo?.cpu"
			class="flex flex-1 flex-nowrap text-sm line-clamp-2 w-available"
		>
			<p
				class="w-40 flex-grow whitespace-nowrap text-sm"
			>
				{{ $t("CPU") }} #{{ index + 1 }}
			</p>
			<p
				class="text-sm line-clamp-2 text-surface-12/11 text-right w-full"
			>
				{{ cpu }}
			</p>
		</div>
		<div
			v-for="(gpu, index) in serverInfo?.gpu"
			class="flex flex-1 flex-nowrap text-sm line-clamp-2 w-available"
		>
			<p
				class="w-40 flex-grow whitespace-nowrap text-sm"
			>
				{{ $t("GPU") }} #{{ index + 1 }}
			</p>
			<p
				class="text-sm line-clamp-2 text-surface-12/11 text-right w-full"
			>
				{{ gpu }}
			</p>
		</div>
	</ServerSystemCard>
</template>

<style lang="scss" scoped>
:root {
	--p-metergroup-label-marker-size: 0.5rem;
}
</style>
