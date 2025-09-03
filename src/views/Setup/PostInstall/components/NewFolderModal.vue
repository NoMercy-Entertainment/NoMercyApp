<script lang="ts" setup>
import type { PropType } from 'vue';
import { useRoute } from 'vue-router';
import { useQueryClient } from '@tanstack/vue-query';

import type { FolderLibrary, LibrariesResponse } from '@/types/api/base/library';

import serverClient from '@/lib/clients/serverClient';
import FolderBrowser from '@/components/FolderBrowser.vue';
import Modal from '@/components/Modal.vue';
import { useToast } from 'primevue/usetoast';
import { translate } from '@/lib/stringArray.ts';

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
			query.invalidateQueries({ queryKey: ['dashboard', 'libraries'] });

			toast.add({
				severity: data.status === 'ok' ? 'success' : 'error',
				summary: translate(data.message, ...data.args),
				life: 2000,
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
		<div class="mx-auto flex w-full flex-col h-[44vh]">
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
				type="button"
				color="text-auto-alpha-11"
				variant="text"
			>
				{{ $t("Cancel") }}
			</Button>
		</template>
	</Modal>
</template>
