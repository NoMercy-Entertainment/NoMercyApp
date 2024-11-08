<script setup lang="ts">
import {PropType, ref, toRaw, watch} from 'vue';
import {SwiperSlide} from 'swiper/vue';

import type {MediaItem} from '@/types/api/base/info';

import Carousel from '@/components/Carousel/Carousel.vue';
import {useEventListener} from '@vueuse/core';
import ImageCard from '@/components/Cards/ImageCard.vue';
import {ColorPalettes} from '@/types/api/shared';
import {
  currentType,
  newIndex,
  setImageModalData,
  setImageModalOpen,
  setTemp,
  showImageModal,
  temp
} from '@/store/imageModal';
import {colorPalette} from '@/store/ui';

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

const setData = (data: MediaItem) => {

  setImageModalData({
    ...data,
    color_palette: toRaw(data.color_palette)
        ? toRaw(data.color_palette)
        : {image: toRaw(colorPalette.value)} as ColorPalettes,
    aspectRatio: props.type == 'poster'
        ? '2/3'
        : '16/9',
  });

  setTemp({
    type: props.type,
    index: props.data.indexOf(data),
  });

  setImageModalOpen(true);
};

const handleLeft = () => {
  const item = props.data[newIndex.value - 1];

  if (!item) return;

  setTemp({
    index: newIndex.value - 1,
    type: props.type,
  });

  setImageModalData({
    ...item,
    color_palette: item.color_palette
        ? toRaw(item.color_palette)
        : {image: toRaw(colorPalette.value)} as ColorPalettes,
    aspectRatio: props.type == 'poster'
        ? '2/3'
        : '16/9',
  });
};

const handleRight = () => {
  const item = props.data[newIndex.value + 1];

  if (!item) return;

  setTemp({
    index: newIndex.value + 1,
    type: props.type,
  });

  setImageModalData({
    ...item,
    color_palette: item.color_palette
        ? toRaw(item.color_palette)
        : {image: toRaw(colorPalette.value)} as ColorPalettes,
    aspectRatio: props.type == 'poster'
        ? '2/3'
        : '16/9',
  });
};

const timeout = ref<NodeJS.Timeout>();
const handlePlay = () => {
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
};

const handleStop = () => {
  clearInterval(timeout.value);
};

watch(showImageModal, value => {
  if (!value) {
    handleStop();
  }
});

useEventListener(document, 'keyup', (event) => {
  if (document.activeElement!.nodeName == 'TEXTAREA') return;
  if (document.activeElement!.nodeName == 'INPUT') return;
  if (event.key == 'Enter' && showImageModal.value) return;

  if (currentType.value != props.type) return;

  console.log(event.key);

  if (event.key == 'ArrowLeft') {
    handleStop();
    handleLeft();
  }
  if (event.key == 'ArrowRight') {
    handleStop();
    handleRight();
  }

  if (event.key == ' ') {
    if (isPlaying.value) {
      handleStop();
    } else {
      handlePlay();
    }
  }

  if (event.key == 'Escape' || event.key == 'Backspace') {
    setImageModalData(null);
    setImageModalOpen(false);
    handleStop();
  }
});

</script>

<template>
  <Carousel :title="title + 's'" :type="type" :disableAutoAspect="type == 'poster'">
    <swiper-slide v-for="item in data" :key="item.id" class="flex">
      <ImageCard :data="item" :aspect="type" :setData="setData"/>
    </swiper-slide>
  </Carousel>
</template>
