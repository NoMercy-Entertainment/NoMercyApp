<script lang="ts" setup>
import type { PropType } from 'vue';
import { ref, watch } from 'vue';
import { FloatLabel } from 'primevue';
import { useToast } from 'primevue/usetoast';
import type { PlaylistItem } from '@/types/musicPlayer.ts';

import serverClient from '@/lib/clients/serverClient.ts';
import { queryClient } from '@/config/tanstack-query.ts';

import Modal from '@/components/Modal.vue';
import Button from '@/components/Button.vue';
import CoverImage from '@/components/MusicPlayer/components/CoverImage.vue';
import ImageDrop from '@/components/ImageDrop.vue';

const props = defineProps({
	data: {
		type: Object as PropType<PlaylistItem>,
		required: true,
	},
	onClose: {
		type: Function as PropType<() => void>,
		required: true,
	},
});

const toast = useToast();

const disabled = ref(true);
const name = ref('');
const description = ref('');
const cover = ref<string | null>(null);

function onImage(data: string) {
	cover.value = data;
}

function submit() {
	serverClient()
		.post(`music/playlists`, {
			name: name.value,
			description: description.value,
			cover: cover.value,
			tracks: [props.data.id],
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

watch(name, (value) => {
	disabled.value = value.trim() === '';
});
</script>

<template>
	<Modal :close="props.onClose" :open="true" max-width="max-w-3xl" title="Add to new Playlist">
		<div class="flex gap-4 mt-4">
			<div class="flex flex-col gap-4">
				<ImageDrop v-if="data" @on-image="onImage">
					<template #default="{ data: data2, ref: imgRef }">
						<CoverImage
							v-if="data2?.cover"
							id="image"
							:data="data2"
							:img-ref="imgRef"
							:size="250"
							class-name="aspect-square rounded-xl min-w-64"
							loading="eager"
						/>
					</template>
				</ImageDrop>
			</div>

			<div class="flex flex-col gap-8 py-2 w-full">
				<FloatLabel class="col-span-4" variant="over">
					<label for="title">{{ $t('Title') }}</label>
					<InputText
						id="title"
						v-model="name"
						class="w-full"
						name=""
						no-ring
						required
					/>
				</FloatLabel>

				<Textarea
					id="description"
					v-model="description"
					:placeholder="$t('Add an optional description')"
					class="w-full"
					name=""
					no-ring
					rows="7"
				/>
			</div>
		</div>

		<template #actions>
			<Button
				id="upload"
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
				start-icon="floppyDisk"
				@click="submit"
			>
				{{ $t("Save") }}
			</Button>
		</template>
	</Modal>
</template>

<style scoped>

</style>
