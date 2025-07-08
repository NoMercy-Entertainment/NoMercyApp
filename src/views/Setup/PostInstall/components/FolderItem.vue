<script setup lang="ts">
import { computed, type PropType, ref, toRaw, watch } from 'vue';

import type { EncoderProfile, FolderLibrary, LibrariesResponse } from '@/types/api/base/library';

import useServerClient from '@/lib/clients/useServerClient.ts';

import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import DeleteEncoderProfileModal	from '@/views/Dashboard/System/EncoderProfiles/components/DeleteEncoderProfileModal.vue';

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
		type: Function as PropType<
			(FolderLibrary: FolderLibrary, profiles: EncoderProfile[]) => void
		>,
		required: true,
	},
});

const emit = defineEmits({
	'update:modelValue': (value: LibrariesResponse) => true,
});

const library = defineModel({
	type: Object as PropType<LibrariesResponse>,
	required: true,
});

const { data: encoderProfiles } = useServerClient<EncoderProfile[]>({
	path: 'dashboard/encoderProfiles',
	queryKey: ['dashboard', 'encoderProfiles'],
});

const availableQualities = computed(() => {
	switch (library.value.type) {
		case 'anime':
			return encoderProfiles.value
				?.filter(encoderQualities => encoderQualities.container === 'm3u8')
				.map(encoderQualities => toRaw(encoderQualities));
		case 'movie':
			return encoderProfiles.value
				?.filter(encoderQualities => encoderQualities.container === 'm3u8')
				.map(encoderQualities => toRaw(encoderQualities));
		case 'tv':
			return encoderProfiles.value
				?.filter(encoderQualities => encoderQualities.container === 'm3u8')
				.map(encoderQualities => toRaw(encoderQualities));
		case 'music':
			return encoderProfiles.value
				?.filter(
					encoderQualities =>
						encoderQualities.container === 'mp3'
						|| encoderQualities.container === 'flac',
				)
				.map(encoderQualities => toRaw(encoderQualities));
		default:
			return [];
	}
});

// Use a local copy of the encoder profiles
const encoderQualities = ref<EncoderProfile[]>(
	availableQualities.value?.filter(quality =>
		props.folder.folder.encoder_profiles?.some(
			profile => profile.id === quality.id,
		),
	) ?? [],
);

// Update the local encoderQualities when the available qualities or folder encoder profiles change
watch([availableQualities, () => props.folder.folder.encoder_profiles], ([newAvailableQualities, newEncoderProfiles]) => {
	if (!newAvailableQualities || !newEncoderProfiles)
		return;

	encoderQualities.value = newAvailableQualities.filter(quality =>
		newEncoderProfiles.some(profile => profile.id === quality.id),
	);
}, { deep: true });

// Handle the MultiSelect change event manually to avoid readonly issues
function handleEncoderQualitiesChange(event: any) {
	// Make a clean copy of the selected profiles
	const selectedProfiles = event.map((quality: EncoderProfile) => toRaw(quality));

	// Update the local state
	encoderQualities.value = selectedProfiles;

	// Notify the parent component about the change
	props.setEncoderQualities(toRaw(props.folder), selectedProfiles);
}

// Watch for library type changes to update available qualities
watch(library, () => {
	if (availableQualities.value) {
		encoderQualities.value = availableQualities.value.filter(quality =>
			props.folder.folder.encoder_profiles.some(
				profile => profile.id === quality.id,
			),
		);
	}
});

const deleteConfirmOpen = ref(false);
function openDeleteConfirm() {
	deleteConfirmOpen.value = true;
}
function closeDeleteConfirm() {
	deleteConfirmOpen.value = false;
}
</script>

<template>
	<div
		class="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-2"
	>
		<MultiSelect
			id="encoderProfiles"
			:model-value="encoderQualities"
			placeholder="Select"
			class="w-[160px]"
			:options="availableQualities"
			option-label="name"
			@update:model-value="handleEncoderQualitiesChange"
		/>

		<div class="flex flex-col justify-center items-center flex-grow gap-2">
			<div
				class="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-10 relative overflow-hidden gap-2 pl-3 pr-2.5 py-2.5 rounded-[10px] bg-[#d5feff]/[0.03]"
			>
				<p class="flex-grow w-available text-base font-semibold text-left text-[#9ba1a6]">
					{{ folder.folder.path }}
				</p>
				<button @click="openDeleteConfirm">
					<MoooomIcon icon="trash" class-name="w-6 h-6 text-[#9ba1a6] flex-grow-0 flex-shrink-0 cursor-pointer" />
				</button>
			</div>
		</div>
	</div>

	<DeleteEncoderProfileModal
		v-if="library?.id"
		:id="library?.id ?? ''"
		:name="library?.title ?? ''"
		:close="closeDeleteConfirm"
		:open="deleteConfirmOpen"
	/>
</template>

<style scoped>

</style>
