<script generic="T extends MusicImageTypes" lang="ts"  setup>
import type { PropType } from 'vue';
import { computed, onBeforeMount, ref } from 'vue';
import type { FileUploadSelectEvent } from 'primevue/fileupload';
import FileUpload from 'primevue/fileupload';
import type { MusicImageTypes } from '@/types/server.ts';
import Button from '@/components/Button.vue';
import type { PlaylistItem } from '@/types/musicPlayer.ts';
import { currentServer } from '@/store/currentServer.ts';
import type { DisplayList } from '@/types/api/music/musicPlayer';

const props = defineProps({
	data: {
		type: Object as PropType<PlaylistItem | DisplayList>,
		required: true,
	},
});

const emit = defineEmits(['onImage']);

const fileUpload = ref();
const image = ref<HTMLImageElement>();
const src = ref<string | ArrayBuffer | null | undefined>(null);
const fileData = ref<any>(null);
const disabled = ref(true);

function onFileSelect(event: FileUploadSelectEvent) {
	const file = event.files[0];
	const reader = new FileReader();

	reader.onload = async (e) => {
		src.value = e.target?.result;
		emit('onImage', e.target?.result as string);
	};

	reader.readAsDataURL(file);

	fileData.value = file;

	disabled.value = false;
}

function onUpload() {
	disabled.value = true;
}

function onRemove() {
	disabled.value = true;
}

function onRemoveTemplatingFile() {
	fileUpload.value.clear();
	fileData.value = null;
	src.value = null;
}

onBeforeMount(async () => {
	if (props.data?.cover == null)
		return;

	const reader = new FileReader();

	reader.onload = async (e) => {
		src.value = e.target?.result;
		fileData.value = e.target?.result;
		emit('onImage', e.target?.result as string);

		disabled.value = false;
	};

	const blob = await fetch(`${currentServer.value?.serverBaseUrl.replace(/\/$/, '')}${props.data?.cover}`)
		.then(r => r.blob());

	reader.readAsDataURL(blob);
});

const url = computed(() => fileData.value?.objectURL?.split('?')?.at(0) ?? fileData.value?.split('?')?.at(0) ?? '');
</script>

<template>
	<div class="relative">
		<FileUpload
			id="imageDrop"
			ref="fileUpload"
			class="p-button-outlined relative"
			mode="basic"
			@remove="onRemove"
			@select="onFileSelect"
			@upload="onUpload"
		>
			<template v-if="!url" #chooseicon>
				<div class="min-w-[286px] aspect-square flex items-center justify-center flex-col">
					<span>
						{{ $t('Drag and drop files to here to upload.') }}
					</span>
				</div>
			</template>
			<template v-else #chooseicon>
				<slot :ref="image" :data="{
					cover: url,
				} as MusicImageTypes"
				/>
			</template>
		</FileUpload>
		<Button
			v-if="!disabled"
			id="clear"
			class="absolute top-2 right-2 z-50 !px-2"
			color="slate"
			end-icon="trash"
			title="Remove Image"
			variant="default"
			@click="onRemoveTemplatingFile"
		/>
	</div>
</template>

<style>
#imageDrop .p-fileupload-basic-content > :not(button),
#imageDrop .p-fileupload-choose-button > :not(div) {
	display: none !important;
}

#imageDrop .p-fileupload-choose-button:has(div > picture):focus-visible,
#imageDrop .p-fileupload-choose-button:has(div > picture):active,
#imageDrop .p-fileupload-choose-button:has(div > picture):hover,
#imageDrop .p-fileupload-choose-button:has(div > picture) {
	border: none !important;
}

#imageDrop .p-button-outlined {
	background: transparent;
	--p-button-outlined-primary-border-color: var(--color-theme-8);
	--p-button-outlined-primary-color: var(--color-theme-8);
	--p-button-padding-y: 0;
	--p-button-padding-x: 0;
}
</style>
