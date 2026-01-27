<script lang="ts" setup>
import type { PropType } from 'vue';
import { ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import type { PlaylistItem } from '@/types/musicPlayer.ts';
import type { ModalData } from '@/types';
import type { DisplayList } from '@/types/api/music/musicPlayer';

import serverClient from '@/lib/clients/serverClient.ts';
import { queryClient } from '@/config/tanstack-query.ts';

import Modal from '@/components/Modal.vue';
import Button from '@/components/Button.vue';
import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import ImageDrop from '@/components/ImageDrop.vue';

const props = defineProps({
	data: {
		type: Object as PropType<ModalData<PlaylistItem | DisplayList>>,
		required: true,
	},
	onClose: {
		type: Function as PropType<() => void>,
		required: true,
	},
	onDelete: {
		type: Function as PropType<() => void>,
		required: true,
	},
});

const toast = useToast();

const disabled = ref(props.data?.modalProps?.name?.trim() === '');
const name = ref(props.data?.modalProps?.name ?? '');
const description = ref(props.data?.modalProps?.description ?? '');
const cover = ref<string | null>(props.data?.modalProps?.cover ?? null);

function onImage(data: string) {
	cover.value = data;
}

function submit() {
	if (props.data?.modalProps?.name == null) {
		serverClient()
			.post(`music/playlists`, {
				name: name.value,
				description: description.value,
				cover: cover.value,
				tracks: [props.data?.modalProps.id],
			})
			.then(({ data }) => {
				queryClient.invalidateQueries({ queryKey: ['music-playlists'] });

				toast.add({
					severity: 'info',
					summary: 'Success',
					detail: 'Image Uploaded',
					life: 3000,
				});

				props.onClose();
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
	else {
		serverClient()
			.patch(props.data?.modalProps.link, {
				name: name.value,
				description: description.value,
				cover: cover.value,
			})
			.then(({ data }) => {
				queryClient.invalidateQueries({ queryKey: ['music-playlists'] });

				toast.add({
					severity: 'info',
					summary: 'Success',
					detail: 'Playlist Updated',
					life: 3000,
				});

				props.onClose();
			})
			.catch((error) => {
				toast.add({
					severity: 'error',
					summary: 'Failed to update playlist',
					detail: error.message,
					life: 3000,
				});
			});
	}
}

watch(name, (value) => {
	disabled.value = value.trim() === '';
});
</script>

<template>
	<Modal :close="props.onClose" :open="true" :params="data.modalTitleArgs" :title="data.modalTitle" max-width="max-w-3xl">
		<div class="flex gap-4 -mb-5 p-1">
			<div class="flex flex-col gap-4 group/cover rounded-lg overflow-clip">
				<ImageDrop v-if="data.modalProps" :data="data.modalProps" @on-image="onImage">
					<template #default="{ data: data2, ref: imgRef }">
						<CoverImage
							v-if="data2?.cover"
							id="image"
							:data="data2"
							:img-ref="imgRef"
							:size="250"
							class-name="aspect-square min-w-72"
							loading="eager"
						/>
						<div class="opacity-0 duration-150 transition-all group-hover/cover:opacity-100 group-hover/cover:bg-black/40 inset-0 absolute grid items-center text-lg font-semibold">
							{{ $t('Drag and drop files to here to upload.') }}
						</div>
					</template>
				</ImageDrop>
			</div>

			<div class="flex flex-col gap-6 w-full">
				<div class="flex flex-col gap-2">
					<label for="title">{{ $t('Title') }}</label>
					<InputText
						id="title"
						v-model="name"
						class="w-full"
						name=""
						no-ring
						required
					/>
				</div>

				<div class="flex flex-col gap-2">
					<label for="description">{{ $t('Description') }}</label>
					<Textarea
						id="description"
						v-model="description"
						:placeholder="$t('Add an optional description')"
						class="w-full scrollbar-thin"
						name=""
						no-ring
						rows="6"
					/>
				</div>
			</div>
		</div>

		<template #actions>
			<Button
				id="delete"
				color="red"
				variant="contained"
				@click="props.onDelete"
			>
				{{ $t("Delete playlist") }}
			</Button>

			<Button
				id="upload"
				class="ml-auto"
				color="white"
				variant="text"
				@click="props.onClose"
			>
				{{ $t("Cancel") }}
			</Button>

			<Button
				id="upload"
				:disabled="disabled"
				color="theme"
				end-icon="floppyDisk"
				@click="submit"
			>
				{{ $t("Save") }}
			</Button>
		</template>
	</Modal>
</template>

<style scoped>

</style>
