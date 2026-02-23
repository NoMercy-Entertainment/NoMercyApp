<script lang="ts" setup>
import { onMounted, ref, useId } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useEventListener } from '@vueuse/core';
import serverClient from './lib/clients/serverClient';
import ContextMenu from 'primevue/contextmenu';
import ConfirmDialog from 'primevue/confirmdialog';

import type { MenuItem } from 'primevue/menuitem';
import type { ToastMessageOptions } from 'primevue';
import type { ModalData } from './types';
import type { PlaylistItem } from '@/types/musicPlayer.ts';
import type { DisplayList } from '@/types/api/music/musicPlayer';

import { queryClient } from './config/tanstack-query';
import { cardMenu, contextMenu, contextMenuItems, trackContextMenuItems } from '@/store/contextMenuItems';

import CreatePlaylistModal from '@/Layout/Desktop/components/Menus/CreatePlaylistModal.vue';

import ImageModal from '@/Layout/ImageModal.vue';

const toast = useToast();
const key = useId();

let _ = cardMenu.value;
_ = contextMenu.value;

function handleToast(data: ToastMessageOptions) {
	toast.add({
		severity: data.severity,
		summary: data.summary,
		detail: data.detail,
		life: data.life,
	});
}

onMounted(async () => {
	document.addEventListener('toast', (event) => {
		handleToast(event.detail);
	});
});

interface ModalEvent {
	detail: {
		modalName: string;
		modalProps: unknown;
	};
}

const playlistModalData = ref<ModalData<PlaylistItem | DisplayList> | null>(null);

function handleModalTrigger(modalName: string, modalProps: unknown) {
	if (modalName === 'createPlaylist') {
		playlistModalData.value = modalProps as unknown as ModalData<PlaylistItem | DisplayList>;
	}
}

function onClose() {
	playlistModalData.value = null;
}

function onDelete() {
	if (!playlistModalData.value)
		return;

	serverClient()
		.delete(`music/playlists/${playlistModalData.value?.modalProps?.id}`)
		.then(({ data }) => {
			queryClient.invalidateQueries({ queryKey: ['music-playlists'] });

			toast.add({
				severity: 'info',
				summary: 'Success',
				detail: 'Playlist Deleted',
				life: 3000,
			});

			onClose();
		})
		.catch((error) => {
			toast.add({
				severity: 'error',
				summary: 'Failed to create playlist',
				detail: error.message,
				life: 3000,
			});
		});
}

useEventListener(document, 'showModal', (evt) => {
	const event = evt as unknown as ModalEvent;
	handleModalTrigger(event.detail.modalName, event.detail);
});
</script>

<template>
	<RouterView />
	<Toast class="z-1199" />
	<CreatePlaylistModal
		v-if="playlistModalData"
		:key="key"
		:data="playlistModalData"
		:on-close="onClose"
		:on-delete="onDelete"
	/>

	<ContextMenu ref="cardMenu" :model="trackContextMenuItems as MenuItem[]" />

	<Suspense>
		<ImageModal />
	</Suspense>
	<ConfirmDialog />
	<ContextMenu ref="contextMenu" :model="contextMenuItems" />
</template>
