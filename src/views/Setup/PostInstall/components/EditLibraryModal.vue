<script lang="ts" setup>
import type { PropType } from 'vue';
import { ref, watch } from 'vue';

import { useQueryClient } from '@tanstack/vue-query';

import type { Language } from '@/types/api/shared';
import type { LibrariesResponse } from '@/types/api/base/library';

import { libraryTypes } from '@/config/config.ts';
import serverClient from '@/lib/clients/serverClient';

import Modal from '@/components/Modal.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import Button from '@/components/Button.vue';
import TypeButton from '@/views/Setup/PostInstall/components/TypeButton.vue';
import FolderItem from '@/views/Setup/PostInstall/components/FolderItem.vue';
import NewFolderModal from './NewFolderModal.vue';
import { useToast } from 'primevue/usetoast';
import { useDebounce } from '@vueuse/core';
import { translate } from '@/lib/utils/string';

const props = defineProps({
	open: {
		type: Boolean,
		required: true,
	},
	close: {
		type: Function as PropType<(e: Event) => any>,
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

const library = defineModel({
	type: Object as PropType<LibrariesResponse>,
	required: true,
});

const query = useQueryClient();
const toast = useToast();

const title = ref<string>(library.value?.title);
const debouncedTitle = useDebounce(title, 500);
const selectedType = ref<string>(library.value?.type ?? 'movie');

watch(library, (newLibrary) => {
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
}

const isSaving = ref(false);

async function handleEdit() {
	if (isSaving.value) return;
	isSaving.value = true;

	try {
		await serverClient()
			.patch(`dashboard/libraries/${library.value.id}`, {
				...library.value,
				subtitles: subtitleLanguages.value.map(l => l.iso_639_1),
				specialSeasonName: library.value.specialSeasonName,
			});
		query.invalidateQueries({ queryKey: ['dashboard', 'libraries'] });
		props.close();
	} catch (err) {
		toast.add({
			severity: 'error',
			summary: translate('Error'),
			detail: err instanceof Error ? err.message : 'Unknown error',
			life: 5000,
		});
	} finally {
		isSaving.value = false;
	}
}

watch(debouncedTitle, (newTitle) => {
	if (!newTitle)
		return;

	serverClient()
		.patch(`dashboard/libraries/${library.value.id}`, {
			title: newTitle,
		})
		.then(() => {
			query.invalidateQueries({ queryKey: ['dashboard', 'libraries'] });
		})
		.catch((err) => {
			toast.add({
				severity: 'error',
				summary: translate('Error'),
				detail: err.message,
				life: 5000,
			});
		});
});

watch(selectedType, (newType) => {
	if (!newType)
		return;

	serverClient()
		.patch(`dashboard/libraries/${library.value.id}`, {
			type: newType,
		})
		.then(() => {
			query.invalidateQueries({ queryKey: ['dashboard', 'libraries'] });
		})
		.catch((err) => {
			toast.add({
				severity: 'error',
				summary: translate('Error'),
				detail: err.message,
				life: 5000,
			});
		});
});
</script>

<template>
	<Modal
		id="editLibraryModal"
		:close="close"
		:open="open"
		background
		max-width="max-w-[565px]"
		no-close
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
						<div class="grid grid-cols-4 justify-start items-start self-stretch gap-2">
							<template v-for="type in libraryTypes" :key="type.value">
								<TypeButton
									:selected="selectedType === type.value"
									:type="type"
									class-name="size-8"
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
										<p class="flex-grow-0 flex-shrink-0 text-sm font-medium text-left">
											{{ $t('Library Title') }}
										</p>
										<p class="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-focus">
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
					<p class="flex-grow w-[501px] text-lg font-medium text-left">
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
							<button
								id="save"
								class="group/button flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-11 relative overflow-hidden gap-2 pl-3 pr-2.5 py-2.5 rounded-[10px] font-semibold transition-colors bg-surface-10/5 hover:bg-surface-12/5 active:bg-surface-12/5 text-surface-12/12 hover:text-surface-12"
								type="button"
								@click="openNewFolderModal"
							>
								<span>{{ $t("Add folder") }}</span>
								<MoooomIcon class-name="w-6 h-6 flex-grow-0 flex-shrink-0 ml-auto"
									icon="folderAdd"
								/>
							</button>
						</div>

						<template v-if="library?.folder_library">
							<template
								v-for="folderLibrary in library?.folder_library"
								:key="folderLibrary.folder_id"
							>
								<FolderItem
									v-model="library"
									:folder="folderLibrary"
								/>
							</template>
						</template>
						<div
							class="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative gap-1"
						>
							<MoooomIcon class-name="w-4 h-4 flex-grow-0 flex-shrink-0" icon="infoCircle" />
							<p class="flex-grow-0 flex-shrink-0 text-sm text-left ">
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
					id="done"
					:disabled="isSaving"
					color="theme"
					type="button"
					variant="contained"
					@click="handleEdit"
				>
					{{ isSaving ? $t("Saving...") : $t("Done") }}
				</Button>
			</div>
		</template>
	</Modal>

	<NewFolderModal
		:close="closeNewModal"
		:folder="folder"
		:library="library"
		:open="newModalOpen"
		:set-folder="setFolder"
	/>
</template>

<style lang="scss">
#editLibraryModal,
#editLibraryModal * {
	--p-overlay-modal-padding: 0.5rem;
	--p-dialog-header-padding: 1.5rem 1rem 0rem 2rem;
	--p-dialog-content-padding: 0.5rem;
	--p-dialog-footer-padding: 0.5rem;
}
</style>
