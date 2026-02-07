<script setup lang="ts">
import type { PropType } from 'vue';
import { onMounted, ref, toRaw, watch } from 'vue';
import { SwiperSlide } from 'swiper/vue';
import type { Gesture, GestureDetail } from '@ionic/vue';
import { createGesture } from '@ionic/vue';
import { useEventListener } from '@vueuse/core';

import type { MediaItem } from '@/types/api/base/info';
import type { ColorPalettes } from '@/types/api/shared';

import {
	currentType,
	newIndex,
	setCurrentType,
	setImageModalData,
	setImageModalOpen,
	setNewIndex,
	setTemp,
	showImageModal,
	temp,
} from '@/store/imageModal';
import { colorPalette } from '@/store/ui';

import Carousel from '@/components/Carousel/Carousel.vue';
import ImageCard from '@/components/Cards/ImageCard.vue';

const props = defineProps({
	data: {
		type: Array as PropType<Array<MediaItem>> | undefined,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	type: {
		type: String as PropType<'poster' | 'backdrop'>,
		required: false,
		default: 'poster',
	},
});

const isPlaying = ref(false);
const gesture = ref<Gesture>();

function setData(data: MediaItem) {
	setImageModalData({
		...data,
		color_palette: toRaw(data.color_palette)
			? toRaw(data.color_palette)
			: ({ image: toRaw(colorPalette.value) } as ColorPalettes),
		aspectRatio: props.type === 'poster' ? '2/3' : '16/9',
	});

	setTemp({
		type: props.type,
		index: props.data.indexOf(data),
	});

	setCurrentType(props.type);

	setImageModalOpen(true);
}

function handleLeft() {
	const item = props.data[newIndex.value - 1];
	if (!item)
		return;

	setTemp({
		index: newIndex.value - 1,
		type: temp.value!.type,
	});

	setImageModalData({
		...item,
		color_palette: item.color_palette
			? toRaw(item.color_palette)
			: ({ image: toRaw(colorPalette.value) } as ColorPalettes),
		aspectRatio: props.type === 'poster' ? '2/3' : '16/9',
	});
	setNewIndex(newIndex.value - 1);
}

function handleRight() {
	const item = props.data[newIndex.value + 1];
	if (!item)
		return;

	setTemp({
		index: newIndex.value + 1,
		type: temp.value!.type,
	});

	setImageModalData({
		...item,
		color_palette: item.color_palette
			? toRaw(item.color_palette)
			: ({ image: toRaw(colorPalette.value) } as ColorPalettes),
		aspectRatio: props.type === 'poster' ? '2/3' : '16/9',
	});

	setNewIndex(newIndex.value + 1);
}

const timeout = ref<NodeJS.Timeout>();
function handlePlay() {
	clearInterval(timeout.value);

	timeout.value = setInterval(() => {
		const item = props.data[newIndex.value + 1];

		if (!item) {
			setTemp({
				index: 0,
				type: props.type,
			});
		}

		handleRight();
	}, 15 * 1000);
}

function handleStop() {
	clearInterval(timeout.value);
}

watch(showImageModal, (value) => {
	if (!value) {
		handleStop();
		// gesture.value?.destroy();
	}
	else {
		// gesture.value?.enable();
	}
});

useEventListener(window, 'keyup', (event) => {
	if (document.activeElement!.nodeName === 'TEXTAREA')
		return;
	if (document.activeElement!.nodeName === 'INPUT')
		return;
	if (event.key === 'Enter' && showImageModal.value)
		return;

	if (currentType.value !== props.type)
		return;

	if (event.key === 'ArrowLeft') {
		handleStop();
		handleLeft();
	}
	if (event.key === 'ArrowRight') {
		handleStop();
		handleRight();
	}

	if (event.key === ' ') {
		if (isPlaying.value) {
			handleStop();
		}
		else {
			handlePlay();
		}
	}

	if (event.key === 'Escape' || event.key === 'Backspace') {
		setImageModalData(undefined);
		setImageModalOpen(false);
		handleStop();
	}
});

onMounted(() => {
	gesture.value = createGesture({
		el: document.querySelector<HTMLDivElement>('#imageModal')!,
		onStart: () => onStart(),
		onMove: detail => onMove(detail),
		onEnd: () => onEnd(),
		gestureName: 'swipe',
	});
});

function onMove({ velocityX }: GestureDetail) {
	if (currentType.value !== props.type)
		return;

	if (velocityX > 0) {
		handleLeft();
	}
	else {
		handleRight();
	}
}

function onStart() {}

function onEnd() {}
</script>

<template>
	<Carousel
		:title="`${title}s`"
		:type="type"
		:disable-auto-aspect="type === 'poster'"
	>
		<SwiperSlide v-for="(item, itemIndex) in data" :key="item.id" :virtual-index="itemIndex" class="flex">
			<ImageCard :data="item" :aspect="type" :set-data="setData" />
		</SwiperSlide>
	</Carousel>
</template>
