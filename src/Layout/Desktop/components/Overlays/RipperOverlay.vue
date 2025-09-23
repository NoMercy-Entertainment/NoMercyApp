<script lang="ts" setup>
import { toRaw, watch } from 'vue';

import type { DriveState } from '@/types/api/dashboard/ripper';

import useMounted from '@/hooks/useMounted';
import useHubListener from '@/hooks/useHubListener';
import {
	ripperSocketConnection,
	ripperSocketIsConnected,
	startRipperSocket,
	stopRipperSocket,
} from '@/lib/clients/ripperSocket';
import serverClient from '@/lib/clients/serverClient';
import { discContents, discs, lastShownDisc, ripperMenuOpen, setRipperMenuOpen } from '@/store/ripper';

import Button from '@/components/Button.vue';
import router from '@/router';

async function getDrives() {
	await serverClient()
		.get<DriveState[]>('dashboard/optical/drives')
		.then((response) => {
			discs.value = response.data;
		});
}

function handleDriveState(data: DriveState) {
	if (data.open) {
		lastShownDisc.value = null;

		discs.value = [
			...(discs.value?.filter(item => item.path !== data.path) ?? []),
			data,
		];

		if (discs.value.length > 0 && discs.value.some(item => item.metadata)) {
			discContents.value = discs.value.find(item => item.metadata);
		}
		else {
			discContents.value = undefined;
			setRipperMenuOpen(false);
		}
	}
	else {
		if (
			!lastShownDisc.value
			|| lastShownDisc.value !== data.label
			|| data.metadata
		) {
			setRipperMenuOpen(true);
			lastShownDisc.value = data.label;
		}

		data = {
			...data,
			metadata: {
				...data.metadata,
				bluRay_playlists: [
					...(data.metadata?.bluRay_playlists?.map((playlist, index) => {
						if (
							playlist.video_tracks?.some(p => p.checked)
							|| playlist.audio_tracks?.some(p => p.checked)
							|| playlist.subtitle_tracks?.some(p => p.checked)
							|| playlist.video_tracks.length > 1
						) {
							playlist.video_tracks?.forEach(p => (p.checked = false));
							playlist.audio_tracks?.forEach(p => (p.checked = false));
							playlist.subtitle_tracks?.forEach(p => (p.checked = false));
						}
						else {
							playlist.video_tracks?.forEach(p => (p.checked = true));
							playlist.audio_tracks?.forEach((p) => {
								p.checked = true;
							});
							playlist.subtitle_tracks?.forEach((p) => {
								p.checked = true;
							});
						}

						playlist.index = index;
						return playlist;
					}) ?? []),
				],
			},
		};

		discs.value = [
			...(discs.value?.filter(item => item.path !== data.path) ?? []),
			data,
		];
	}

	console.log('Ripper menu open state:', data, toRaw(discs.value));
}

function handleRip(disc: DriveState) {
	discContents.value = disc;

	setRipperMenuOpen(false);

	router.push('/dashboard/ripper');
}

watch(ripperSocketIsConnected, async (value) => {
	if (value) {
		await getDrives();

		for (const drive of discs.value ?? []) {
			if (discContents.value?.path === drive.path) {
				discContents.value = undefined;
			}

			if (!drive.label)
				continue;
			ripperSocketConnection.value
				?.invoke('GetDriveState', drive.path)
				.then(data => handleDriveState(data))
				.catch(error => console.error('GetDriveState:', error));
		}
	}
	else {
		console.log('Disconnected from ripper socket');
	}
});

useMounted(startRipperSocket, stopRipperSocket, 10);

useHubListener(ripperSocketConnection, 'DriveState', handleDriveState);
</script>

<template>
	<div
		id="ripperContainer"
		:data-open="ripperMenuOpen"
		:inert="!ripperMenuOpen"
		class="absolute flex-col p-4 inset-0 h-1/5 sm:h-2/5 xl:h-1/5 w-inherit sm:left-auto sm:right-4 sm:top-4 sm:bottom-4 sm:w-3/5 xl:w-1/3 sm:max-w-3xl tv:max-w-3/4 flex items-center justify-center rounded-xl transition-all duration-500 data-[open='false']:translate-x-[150%] overflow-clip z-[9999] tv:data-[open='false']:translate-x-[150%] tv:!w-available tv:data-[open='true']:delay-500 will-change-transform bg-surface-12 dark:bg-surface-1"
	>
		<div class="flex w-full gap-4 justify-between text-lg font-bold">
			<span>{{ $t("Disc inserted") }}</span>
			<Button
				id="close"
				color="theme"
				type="submit"
				variant="contained"
				@click.stop="setRipperMenuOpen(false)"
			>
				{{ $t("Close") }}
			</Button>
		</div>

		<div v-if="discs" class="w-full mt-4 h-available">
			<template v-for="disc in discs" :key="disc.path">
				<div class="mb-6 flex w-full justify-between items-center">
					<h1 class="text-lg font-bold">
						{{ disc.path }}: {{ disc.label }}
					</h1>

					<Button
						v-if="!!disc.metadata"
						id="close"
						color="theme"
						type="submit"
						variant="contained"
						@click.stop="handleRip(disc)"
					>
						{{ $t("Rip") }}
					</Button>
				</div>
			</template>
		</div>
		<div
			v-if="discs.some((disc) => !disc.open && !disc.metadata)"
			class="flex items-center justify-center h-full"
		>
			<svg
				aria-hidden="true"
				class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-focus"
				fill="none"
				viewBox="0 0 100 101"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
					fill="currentColor"
				/>
				<path
					d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
					fill="currentFill"
				/>
			</svg>
		</div>
	</div>
</template>

<style scoped></style>
