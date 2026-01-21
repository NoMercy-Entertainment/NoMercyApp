<script generic="T extends MusicImageTypes" lang="ts"  setup>
import type { PropType } from 'vue';
import { computed, ref, watch } from 'vue';
import type { FileUploadBeforeSendEvent, FileUploadSelectEvent, FileUploadUploadEvent } from 'primevue/fileupload';
import FileUpload from 'primevue/fileupload';
import { useToast } from 'primevue/usetoast';
import type { MusicImageTypes } from '@/types/server.ts';

import { user } from '@/store/user.ts';

import Modal from '@/components/Modal.vue';
import Button from '@/components/Button.vue';
import { currentServer } from '@/store/currentServer.ts';
import { setColorPalette } from '@/store/ui.ts';

const props = defineProps({
	data: {
		type: Object as PropType<MusicImageTypes>,
		required: true,
	},
	url: {
		type: String,
		required: true,
	},
});

const trigger = ref<HTMLElement | null>(null);
const open = ref(false);

const data2 = ref(props.data);

function close() {
	open.value = false;
}

function setOpen() {
	open.value = true;
}

const toast = useToast();
const fileUpload = ref();
const image = ref<HTMLImageElement>();
const coverUrl = ref(props.data.cover);
const disabled = ref(true);

const uploadUrl = computed(() => `${currentServer.value?.serverApiUrl}${props.url}`);

function upload() {
	fileUpload.value.upload();
	disabled.value = true;
}

function onUpload(event: FileUploadUploadEvent) {
	toast.add({
		severity: 'info',
		summary: 'Success',
		detail: 'File Uploaded',
		life: 3000,
	});

	const { data } = JSON.parse(event.xhr.response);

	coverUrl.value = data.url;
	setColorPalette(data.color_palette?.cover);
	close();

	// serverClient()
	// 	.delete(url)
	// 	.then(async () => {
	// 		coverUrl.value = url;
	// 		close();
	// 	});
}

function handleSelected(e: FileUploadSelectEvent) {
	coverUrl.value = e.files[0].objectURL;
	disabled.value = false;
}

function beforeSend(e: FileUploadBeforeSendEvent) {
	e.xhr.setRequestHeader('Authorization', `Bearer ${user.value.accessToken}`);
}

function handleReset() {
	coverUrl.value = props.data.cover;
	fileUpload.value.clear();
	close();
}

watch(coverUrl, (newUrl) => {
	data2.value = {
		...data2.value,
		cover: newUrl,
	} as T;
});
</script>

<template>
	<button id="uploadDialogTrigger" ref="trigger" class="contents" @click="setOpen">
		<slot :ref="image" :data="data2" />
		<div class="opacity-0 duration-150 transition-all group-hover/cover:opacity-100 group-hover/cover:bg-black/40 inset-0 absolute grid items-center text-lg font-semibold">
			{{ $t("Change cover") }}
		</div>
	</button>

	<Modal :close="close" :open="open" max-width="max-w-2xl" title="Upload image">
		<FileUpload
			ref="fileUpload"
			:cancel-label="$t('Cancel')"
			:choose-label="$t('Choose image')"
			:max-file-size="2 * 1024 * 1024"
			:url="uploadUrl"
			accept="image/*"
			class="p-button-outlined"
			mode="basic"
			name="image"
			with-credentials
			@select="handleSelected"
			@upload="onUpload"
			@before-send="beforeSend"
		/>

		<template #actions>
			<Button
				id="upload"
				color="white"
				variant="text"
				@click="handleReset"
			>
				{{ $t("Cancel") }}
			</Button>

			<Button
				id="upload"
				:disabled="disabled"
				color="theme"
				@click="upload"
			>
				{{ $t("Save") }}
			</Button>
		</template>
	</Modal>
</template>

<style scoped>

</style>
