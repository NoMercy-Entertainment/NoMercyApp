<script lang="ts" setup>
import { type PropType, ref, watch } from 'vue';

import { useQueryClient } from '@tanstack/vue-query';

import type { Language } from '@/types/api/shared';
import type { EncoderProfile, FolderLibrary, LibrariesResponse } from '@/types/api/base/library';

import { libraryTypes } from '@/config/config.ts';
import serverClient from '@/lib/clients/serverClient';
import router from '@/router';

import Modal from '@/components/Modal.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import Button from '@/components/Buttons/Button.vue';
import TypeButton from '@/views/Setup/PostInstall/components/TypeButton.vue';
import FolderItem from '@/views/Setup/PostInstall/components/FolderItem.vue';
import NewFolderModal from '@/views/Dashboard/System/Libraries/components/NewFolderModal.vue';

const props = defineProps({
	open: {
		type: Boolean,
		required: true,
	},
	close: {
		type: Function as PropType<() => any>,
		required: true,
	},
	id: {
		type: String,
		required: true,
	},
	noRedirect: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits({
	'update:modelValue': (value: LibrariesResponse) => true,
});

const library = defineModel({
	type: Object as PropType<LibrariesResponse>,
	required: true,
});

const query = useQueryClient();

const title = ref<string>(library.value?.title);
const selectedType = ref<string>(library.value?.type ?? 'movie');

// Update the parent library object when title changes
watch(title, (value) => {
	if (!value || !library.value)
		return;

	library.value = {
		...library.value,
		title: value,
	};
});

// Update the parent library object when type changes
watch(selectedType, (value) => {
	if (!value || !library.value)
		return;

	library.value = {
		...library.value,
		type: value,
	};
});

// Also watch for changes to the library prop to update local state
watch(() => library.value, (newLibrary) => {
	if (!newLibrary)
		return;
	title.value = newLibrary.title;
	selectedType.value = newLibrary.type || 'movie';

	// Initialize folder_library if it doesn't exist
	if (!library.value.folder_library) {
		library.value = {
			...library.value,
			folder_library: [],
		};
	}
}, { deep: true });

const subtitleLanguages = ref<Language[]>([]);

const folder = ref<string>('/');

function setFolder(value: string) {
	folder.value = value;
}

const newModalOpen = ref(false);
function openNewFolderModal() {
	newModalOpen.value = true;
}
function closeNewModal() {
	newModalOpen.value = false;

	// Ensure changes from NewFolderModal are properly reflected
	if (library.value && !library.value.folder_library) {
		library.value = {
			...library.value,
			folder_library: [],
		};
	}
}

function handleEdit() {
	if (!library.value)
		return;

	serverClient()
		.patch(`dashboard/libraries/${library.value.id}`, {
			...library.value,
			subtitles: subtitleLanguages.value.map(l => l.iso_639_1),
			specialSeasonName: library.value.specialSeasonName,
		})
		.then(() => {
			query.invalidateQueries({ queryKey: ['dashboard', 'libraries'] });

			if (props.noRedirect)
				return;
			router.replace('/dashboard/system/libraries');
		});

	props.close();
}

function setEncoderQualities(folder: FolderLibrary, profiles: EncoderProfile[]) {
	if (!library.value)
		return;

	// Create a fresh copy of the folder_library array
	const updatedFolderLibraries = library.value.folder_library.map((f) => {
		if (f.folder_id === folder.folder_id) {
			return {
				...f,
				folder: {
					...f.folder,
					encoder_profiles: profiles.map(p => p),
				},
			};
		}
		return f;
	});

	// Replace the entire folder_library array
	emit('update:modelValue', {
		...library.value,
		folder_library: updatedFolderLibraries,
	});
}

function handleDeleteFolder(folder: FolderLibrary) {
	if (!library.value)
		return;

	library.value = {
		...library.value,
		folder_library: library.value.folder_library.filter(f => f.folder_id !== folder.folder_id),
	};
}

function setLibraryType(type: string) {
	if (!library.value)
		return;

	library.value = {
		...library.value,
		type,
	};
	selectedType.value = type;
}
</script>

<template>
	<Modal
		id="editLibraryModal"
		:close="close"
		:open="open"
		max-width="max-w-[565px]"
		title="Edit Library"
	>
		<div
			class="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-full relative gap-8 p-1 px-6"
		>
			<div
				class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-3"
			>
				<div
					class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-6"
				>
					<div
						class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-4"
					>
						<div class="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0">
							<template v-for="type in libraryTypes" :key="type.value">
								<TypeButton
									:type="type"
									:selected="selectedType === type.value"
									class-name="size-10"
									@click="selectedType = type.value"
								/>
							</template>
						</div>
						<div
							class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2"
						>
							<div
								class="flex justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2"
							>
								<div class="flex flex-col justify-start items-start flex-grow gap-1.5">
									<div
										class="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-px"
									>
										<p class="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-[#eeecec]">
											{{ $t('Library Title') }}
										</p>
										<p class="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-[#6e56cf]">
											*
										</p>
									</div>
									<InputText
										id="title"
										v-model="title"
										class="w-full"
										required
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="flex-grow-0 flex-shrink-0 w-10 h-0.5 rounded bg-[#e2f0fd]/[0.08]" />
			<div
				class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-3"
			>
				<div
					class="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-2 rounded"
				>
					<p class="flex-grow w-[501px] text-lg font-medium text-left text-[#eeecec]">
						{{ $t('Select one or more folders') }}
					</p>
				</div>
				<div
					class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-6"
				>
					<div
						class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2"
					>
						<div
							class="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-2"
						>
							<Button
								id="save"
								type="button"
								color="slate"
								class="w-full flex justify-between"
								end-icon="folderAdd"
								@click="openNewFolderModal"
							>
								{{ $t("Add folder") }}
							</Button>
						</div>

						<template v-if="library?.folder_library">
							<template
								v-for="folderLibrary in library?.folder_library"
								:key="folderLibrary.folder_id"
							>
								<FolderItem
									v-model="library"
									:folder="folderLibrary"
									:set-encoder-qualities="setEncoderQualities"
									:handle-delete-folder="handleDeleteFolder"
								/>
							</template>
						</template>
						<div
							class="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-1"
						>
							<MoooomIcon icon="infoCircle" class-name="w-4 h-4 text-[#9ba1a6] flex-grow-0 flex-shrink-0" />
							<p class="flex-grow-0 flex-shrink-0 text-sm text-left text-[#9ba1a6]">
								{{ $t('You can always add folder and change encoding profiles later') }}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<template #actions>
			<div
				class="flex w-full justify-end items-start self-stretch flex-grow-0 flex-shrink-0 gap-2 rounded-lg bg-white/[0.04] p-2"
			>
				<Button
					id="save"
					type="button"
					color="theme"
					@click="handleEdit"
				>
					{{ $t("Create library") }}
				</Button>
			</div>
		</template>
	</Modal>

	<NewFolderModal
		:close="closeNewModal"
		:folder="folder"
		:open="newModalOpen"
		:set-folder="setFolder"
		:library="library"
	/>
</template>

<style lang="scss">
  #editLibraryModal,
#editLibraryModal * {
	--p-overlay-modal-padding: 0.5rem;
	--p-dialog-header-padding: 1.5rem 1rem 0rem 2.5rem;
	--p-dialog-content-padding: 0.5rem;
	--p-dialog-footer-padding: 0.5rem;
}
</style>
