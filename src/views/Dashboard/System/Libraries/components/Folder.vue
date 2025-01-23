<script setup lang='ts'>
import { computed, PropType, ref, toRaw, watch } from 'vue';

import type { EncoderProfile, FolderLibrary } from '@/types/api/base/library';

import useServerClient from "@/lib/clients/useServerClient";

import DeleteFolderModal from "./DeleteFolderModal.vue";

const props = defineProps({
	handleDeleteFolder: {
		type: Function,
		required: true,
	},
	folder: {
		type: Object as PropType<FolderLibrary>,
		required: true,
	},
	setEncoderQualities: {
		type: Function as PropType<(FolderLibrary: FolderLibrary, profiles: EncoderProfile[]) => void>,
		required: true,
	},
	type: {
		type: String,
		required: true,
	},
});

const { data: encoderProfiles } = useServerClient<EncoderProfile[]>({
	path: 'dashboard/encoderProfiles',
	queryKey: ['dashboard', 'encoderProfiles'],
});

const availableQualities = computed(() => {
	switch (props.type) {
		case 'anime':
			return encoderProfiles.value?.filter(encoderQualities => encoderQualities.container == 'm3u8').map(encoderQualities => toRaw(encoderQualities));
		case 'movie':
			return encoderProfiles.value?.filter(encoderQualities => encoderQualities.container == 'm3u8').map(encoderQualities => toRaw(encoderQualities));
		case 'tv':
			return encoderProfiles.value?.filter(encoderQualities => encoderQualities.container == 'm3u8').map(encoderQualities => toRaw(encoderQualities));
		case 'music':
			return [];
		default:
			return [];
	}
});

const encoderQualities = ref<EncoderProfile[]>(availableQualities.value?.filter((quality) => props.folder.folder.encoder_profiles?.some((profile) => profile.id === quality.id)) ?? []);
watch(availableQualities, (newVal) => {
	if (!newVal) return;
	encoderQualities.value = newVal.filter((quality) => props.folder.folder.encoder_profiles.some((profile) => profile.id === quality.id));
});

watch(encoderQualities, (newVal) => {
	props.setEncoderQualities(toRaw(props.folder), toRaw(newVal));
});

const deleteConfirmOpen = ref(false);
const openDeleteConfirm = () => {
	deleteConfirmOpen.value = true;
};
const closeDeleteConfirm = () => {
	deleteConfirmOpen.value = false;
};

</script>

<template>
	<div
		class='flex w-full flex-col items-center justify-between gap-2 rounded-md px-4 py-2 pr-2 odd:bg-auto-alpha-3 even:bg-auto-alpha-2 sm:flex-row'>
		<span class="mr-auto flex w-full flex-1 flex-grow">
			{{ folder.folder.path }}
		</span>

		<div class="ml-auto flex w-full gap-2 sm:w-auto">
			<MultiSelect id="encoderProfiles" placeholder="Select encoder profiles"
				class="w-full min-w-[200px] sm:w-auto" :options="availableQualities" optionLabel="name"
				v-model="encoderQualities" />

			<Button type="button" id="yes" variant="text"
				class="children:text-gray-400 children:transition-colors children:duration-100 children:hover:text-red-dark-8"
				color="red" startIcon="folderRemove" @click="openDeleteConfirm">
			</Button>

			<DeleteFolderModal :id="folder.folder.id" :name="folder.folder.path" :close="closeDeleteConfirm"
				:open="deleteConfirmOpen" />

		</div>
	</div>

</template>
