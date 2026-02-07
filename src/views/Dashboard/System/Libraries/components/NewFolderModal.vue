<script lang="ts" setup>
import type { PropType } from 'vue';
import { toRaw } from 'vue';
import { useRoute } from 'vue-router';
import { useQueryClient } from '@tanstack/vue-query';

import type { FolderLibrary, LibrariesResponse } from '@/types/api/base/library';

import serverClient from '@/lib/clients/serverClient';
import FolderBrowser from '@/components/FolderBrowser.vue';
import Modal from '@/components/Modal.vue';
import { useToast } from 'primevue/usetoast';
import { translate } from '@/lib/utils/string';

const props = defineProps({
	open: {
		type: Boolean,
		required: true,
	},
	close: {
		type: Function as PropType<() => any>,
		required: true,
	},
	folder: {
		type: String,
		required: true,
	},
	setFolder: {
		type: Function as PropType<(folder: string) => void>,
		required: true,
	},
	library: {
		type: Object as PropType<LibrariesResponse>,
		required: false,
	},
});

const route = useRoute();
const query = useQueryClient();
const toast = useToast();

function handleCreateFolder() {
	serverClient()
		.post<{
		message: string;
		status: string;
		args: string[];
		data?: FolderLibrary;
	}>(`dashboard/libraries/${route.params.id ?? props.library?.id}/folders`, {
			path: props.folder,
		})
		.then(({ data }) => {
			// Update the parent library state with the new folder
			if (data.status === 'ok' && data.data && props.library) {
				// Create a new library object with the updated folder_library array
				props.library.folder_library = [
					...toRaw(props.library.folder_library || []),
					data.data,
				];
			}

			// Invalidate queries to refresh library data from server
			query.invalidateQueries({ queryKey: ['dashboard', 'libraries'] });

			toast.add({
				severity: data.status === 'ok' ? 'success' : 'error',
				summary: translate(data.status === 'ok' ? 'Success' : 'Error'),
				detail: translate(data.message, ...data.args),
				life: 5000,
			});

			props.setFolder('/');
			props.close();
		})
		.catch((error) => {
			console.error('Error adding folder:', error);
			// Close modal even on error
			props.close();
		});
}
</script>

<template>
	<Modal :close="close" :open="open" max-width="max-w-5xl" title="Add folder">
		<div class="mx-auto flex w-full flex-col h-available overflow-clip">
			<FolderBrowser :selected="folder" :set-selected="setFolder" />
		</div>

		<template #actions>
			<Button
				id="yes"
				:onclick="handleCreateFolder"
				color="theme"
				type="button"
				variant="contained"
			>
				{{ $t("Add") }}
			</Button>
			<Button
				id="no"
				:onclick="close"
				color="auto"
				type="button"
				variant="text"
			>
				{{ $t("Cancel") }}
			</Button>
		</template>
	</Modal>
</template>
