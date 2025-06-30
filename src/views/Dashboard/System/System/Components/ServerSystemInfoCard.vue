<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import type {
	PauseResumeResponse,
	RunnersResponse,
	ServerInfo,
} from '@/types/api/dashboard/server';

import useServerClient from '@/lib/clients/useServerClient';
import serverClient from '@/lib/clients/serverClient';
import { currentServer } from '@/store/currentServer';
// import { useVideoSocket } from '@/store/videoSocket';

import OptimizedIcon from '@/components/OptimizedIcon.vue';
import KeepCounting from '@/components/KeepCounting.vue';

import ServerSystemCard from './ServerSystemCard.vue';

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

// function connected() {
// 	isOnline.value = true;
// 	refetch();
// }
// function disconnected() {
// 	isOnline.value = false;
// }

onMounted(() => {
	// const socket = useVideoSocket();
	// socket?.onreconnected(connected);
	// socket?.onclose(disconnected);
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
				class="relative h-7 flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2 overflow-hidden border border-solid border-slate-light-10 dark:border-slate-dark-10 text-slate-light-12/80 dark:text-slate-dark-12/80 rounded-lg pl-1 pr-2 py-1"
			>
				<OptimizedIcon icon="pause" class="w-4" />
				<p class="flex-shrink-0 flex-grow-0 text-sm">
					{{ $t("Pause") }}
				</p>
			</button>
			<button
				class="relative h-7 flex flex-shrink-0 flex-grow-0 items-center justify-center gap-2 overflow-hidden border border-solid border-slate-light-10 dark:border-slate-dark-10 text-slate-light-12/80 dark:text-slate-dark-12/80 rounded-lg pl-1 pr-2 py-1"
			>
				<OptimizedIcon icon="shutdown" class="w-4" />
				<p class="flex-shrink-0 flex-grow-0 text-sm">
					{{ $t("Shutdown") }}
				</p>
			</button>
		</template>

		<div
			class="relative flex flex-shrink-0 flex-grow-0 items-start justify-start gap-4 self-stretch overflow-clip w-available"
		>
			<p
				class="w-auto flex-grow whitespace-nowrap text-sm text-slate-light-12 dark:text-slate-dark-12"
			>
				{{ $t("Server") }}
			</p>
			<p
				class="flex-shrink-0 flex-grow-0 text-sm line-clamp-1 text-slate-light-10 dark:text-slate-dark-10"
			>
				{{ serverInfo?.server }}
			</p>
		</div>
		<div
			class="relative flex flex-shrink-0 flex-grow-0 items-start justify-start gap-4 self-stretch overflow-clip w-available"
		>
			<p
				class="w-auto flex-grow whitespace-nowrap text-sm text-slate-light-12 dark:text-slate-dark-12"
			>
				{{ $t("Server version") }}
			</p>
			<p
				class="flex-shrink-0 flex-grow-0 text-sm line-clamp-1 text-slate-light-10 dark:text-slate-dark-10"
			>
				{{ serverInfo?.version }}
			</p>
		</div>
		<div
			class="relative flex flex-shrink-0 flex-grow-0 items-start justify-start gap-4 self-stretch overflow-clip w-available"
		>
			<p
				class="w-auto flex-grow whitespace-nowrap text-sm text-slate-light-12 dark:text-slate-dark-12"
			>
				{{ $t("Uptime") }}
			</p>
			<p
				class="flex-shrink-0 flex-grow-0 text-sm line-clamp-1 text-slate-light-10 dark:text-slate-dark-10"
			>
				<KeepCounting
					:key="serverInfo?.bootTime"
					:start-time="serverInfo?.bootTime"
				/>
			</p>
		</div>
		<div
			class="relative flex flex-shrink-0 flex-grow-0 items-start justify-start gap-4 self-stretch overflow-clip w-available"
		>
			<p
				class="w-auto flex-grow whitespace-nowrap text-sm text-slate-light-12 dark:text-slate-dark-12"
			>
				{{ $t("OS") }}
			</p>
			<p
				class="flex-shrink-0 flex-grow-0 text-sm line-clamp-1 text-slate-light-10 dark:text-slate-dark-10"
			>
				{{ serverInfo?.os.toTitleCase() }}
			</p>
		</div>
		<div
			class="relative flex flex-shrink-0 flex-grow-0 items-start justify-start gap-4 self-stretch overflow-clip w-available"
		>
			<p
				class="w-auto flex-grow whitespace-nowrap text-sm text-slate-light-12 dark:text-slate-dark-12"
			>
				{{ $t("Architecture") }}
			</p>
			<p
				class="flex-shrink-0 flex-grow-0 text-sm line-clamp-1 text-slate-light-10 dark:text-slate-dark-10"
			>
				{{ serverInfo?.arch }}
			</p>
		</div>
		<div
			v-for="(cpu, index) in serverInfo?.cpu"
			class="relative flex flex-shrink-0 flex-grow-0 items-start justify-start gap-4 self-stretch overflow-clip w-available"
		>
			<p
				class="w-auto flex-grow whitespace-nowrap text-sm text-slate-light-12 dark:text-slate-dark-12"
			>
				{{ $t("CPU") }} #{{ index + 1 }}
			</p>
			<p
				class="flex-shrink-0 flex-grow-0 text-sm line-clamp-1 text-slate-light-10 dark:text-slate-dark-10"
			>
				{{ cpu }}
			</p>
		</div>
		<div
			v-for="(gpu, index) in serverInfo?.gpu"
			class="relative flex flex-shrink-0 flex-grow-0 items-start justify-start gap-4 self-stretch overflow-clip w-available"
		>
			<p
				class="w-auto flex-grow whitespace-nowrap text-sm text-slate-light-12 dark:text-slate-dark-12"
			>
				{{ $t("GPU") }} #{{ index + 1 }}
			</p>
			<p
				class="flex-shrink-0 flex-grow-0 text-sm line-clamp-1 text-slate-light-10 dark:text-slate-dark-10"
			>
				{{ gpu }}
			</p>
		</div>
	</ServerSystemCard>
</template>

<style scoped lang="scss">
:root {
	--p-metergroup-label-marker-size: 0.5rem;
}
</style>
