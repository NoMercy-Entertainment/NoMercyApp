<script setup lang="ts">
import {computed, onMounted, PropType, ref, toRaw, watch} from 'vue';
import {SwiperSlide} from 'swiper/vue';
import {createGesture, Gesture, GestureDetail} from '@ionic/vue';
import {useEventListener} from '@vueuse/core';

import type {MediaItem} from '@/types/api/base/info';
import type {ColorPalettes} from '@/types/api/shared';

import {
  currentType,
  newIndex,
  setCurrentType,
  setImageModalData,
  setImageModalOpen, setNewIndex,
  setTemp,
  showImageModal, temp,
} from '@/store/imageModal';
import {colorPalette} from '@/store/ui';

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

  setCurrentType(props.type);

  setImageModalOpen(true);
};

const handleLeft = () => {
  const item = props.data[newIndex.value - 1];
  if (!item) return;

  setTemp({
    index: newIndex.value - 1,
    type: temp.value.type,
  });
  setNewIndex(newIndex.value - 1);

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
    type: temp.value.type,
  });

  setNewIndex(newIndex.value + 1);

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
    gesture.value?.destroy();
  } else {
    gesture.value?.enable();
  }
});

useEventListener(window, 'keyup', (event) => {
  if (document.activeElement!.nodeName == 'TEXTAREA') return;
  if (document.activeElement!.nodeName == 'INPUT') return;
  if (event.key == 'Enter' && showImageModal.value) return;

  if (currentType.value != props.type) return;

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

onMounted(() => {
  gesture.value = createGesture({
    el: document.querySelector<HTMLDivElement>('#imageModal')!,
    onStart: () => onStart(),
    onMove: (detail) => onMove(detail),
    onEnd: () => onEnd(),
    gestureName: 'swipe',
  });
});

const onMove = ({velocityX}: GestureDetail) => {
  if (currentType.value != props.type) return;

  if  (velocityX > 0) {
    handleLeft();
  } else {
    handleRight();
  }
};

const onStart = () => {
};

const onEnd = () => {
};

</script>

<template>
  <Carousel :title="title + 's'" :type="type" :disableAutoAspect="type == 'poster'">
    <swiper-slide v-for="item in data" :key="item.id" class="flex">
      <ImageCard :data="item" :aspect="type" :setData="setData"/>
    </swiper-slide>
  </Carousel>
</template>
