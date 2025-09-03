<script lang="ts" setup>
import type { PropType } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue';

import type { LibrariesResponse } from '@/types/api/base/library';

import EditLibraryModal from '../components/EditLibraryModal.vue';
import DeleteLibraryModal from '../components/DeleteLibraryModal.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import type { MoooomIcons } from '@Icons/icons.ts';

const library = defineModel({
	type: Object as PropType<LibrariesResponse>,
	required: true,
});

const deleteLibraryConfirmOpen = ref(false);
function openDeleteConfirm() {
	deleteLibraryConfirmOpen.value = true;
}
function closeDeleteConfirm() {
	deleteLibraryConfirmOpen.value = false;
}

const editLibraryOpen = ref(false);
function openEdit() {
	editLibraryOpen.value = true;
}
function closeEdit() {
	editLibraryOpen.value = false;
}

const icon = computed<keyof typeof MoooomIcons>(() => {
	let string: keyof typeof MoooomIcons;

	switch (library.value.type) {
		case 'music':
			string = 'noteDouble';
			break;
		case 'tv':
			string = 'tv';
			break;
		case 'image':
			string = 'camera';
			break;
		case 'movie':
			string = 'film';
			break;
		default:
			string = 'nomercy';
	}

	return string;
});
</script>

<template>
	<div
		class="flex h-min children:cursor-default flex-col items-center rounded-lg w-inherit odd:bg-auto-300/20 even:bg-auto-300/0"
	>
		<div class="flex items-center gap-2 overflow-x-hidden py-2 pr-2 w-inherit overflow-y-show">
			<button class="ml-2 h-auto w-8 p-2 handle">
				<MoooomIcon icon="menuDotsVertical" class="h-6 w-6" />
			</button>
			<MoooomIcon :icon="icon" class="h-6 w-6" />
			<span class="w-full line-clamp-1">
				{{ library?.title }}
			</span>

			<button
				class="ml-auto flex justify-center items-center h-10 px-2.5 py-2 gap-2 rounded-lg text-sm select-none w-auto font-semibold leading-[100%] transition-all duration-150 button-text hover:outline-[rgba(var(--color-500),.1)] hover:outline-1 hover:outline text-[var(--color-500)]"
				type="button"
				@click="openEdit"
			>
				<MoooomIcon icon="folderEdit" class="h-6 w-6" />
			</button>

			<button
				class="ml-auto flex justify-center items-center h-10 px-2.5 py-2 gap-2 rounded-lg text-sm select-none w-auto font-semibold leading-[100%] transition-all duration-150 button-text hover:outline-[rgba(var(--color-500),.1)] hover:outline-1 hover:outline text-[var(--color-500)]"
				type="button"
				@click="openDeleteConfirm"
			>
				<MoooomIcon icon="folderRemove" class="h-6 w-6" />
			</button>
		</div>

		<EditLibraryModal
			v-if="library"
			:id="library?.id"
			v-model="library"
			:close="closeEdit"
			:open="editLibraryOpen"
		/>

		<DeleteLibraryModal
			v-if="library"
			:id="library?.id"
			:name="library.title"
			:close="closeDeleteConfirm"
			:open="deleteLibraryConfirmOpen"
		/>
	</div>
</template>
