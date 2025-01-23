<script lang="ts" setup>
import { computed, type PropType, ref } from 'vue';
import { SwiperSlide } from 'swiper/vue';

import type { KnownFor } from '@/types/api/base/person';
import type { InfoResponse } from '@/types/api/base/info';
import type { Collection } from '@/types/api/base/collection';
import type { ContinueWatching, HomeItem } from '@/types/api/base/home';
import type { LibraryResponse } from '@/types/api/base/library';
import type { ColorPalettes } from '@/types/api/shared';
import type { MenuItem } from 'primevue/menuitem';

import { setBackground, setColorPalette, setPoster, setTitle } from '@/store/ui';

import Carousel from '@/components/Carousel/Carousel.vue';
import MediaCard from '@/components/Cards/MediaCard.vue';
import { showBackdrops } from '@/store/preferences';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const props = defineProps({
  data: {
    type: Array as PropType<Array<LibraryResponse | InfoResponse | HomeItem | ContinueWatching | Collection | KnownFor>>,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  moreLink: {
    type: String,
    required: false,
  },
  type: {
    type: String as PropType<'poster' | 'backdrop'>,
    required: false,
  },
  suffix: {
    type: String,
    required: false,
    default: '',
  },
  index: {
    type: Number,
    required: false,
    default: 0,
  },
  limitCardCountBy: {
    type: Number,
    required: false,
  },
  disableAutoAspect: {
    type: Boolean,
    required: false,
    default: false,
  },
  menuItems: {
    type: Array as PropType<MenuItem[]>,
    required: false,
    default: () => [],
  },
  onRightClick: {
    type: Function as PropType<(event: MouseEvent, item: any) => void>,
    required: false,
  },
  // cardMenu: {
  // 	type: Object as PropType<Ref>,
  // 	required: false,
  // },
  colorPalette: {
    type: Object as PropType<ColorPalettes | undefined>,
    required: false,
  },
});

const handleClick = (item: any) => {
  if (item?.backdrop) {
    setBackground(item?.backdrop);
  }
  if (item?.poster) {
    setPoster(item.poster);
  }
  if (item.title) {
    setTitle(item.title);
  }
  if (item.color_palette) {
    setColorPalette(item.color_palette.poster);
  }
};

const backdropCards = computed(() => {
  return showBackdrops.value && props.type !== 'poster';
});

const cardMenu = ref();

const onRightClick = (event: MouseEvent, item: any) => {
  if (props.onRightClick) {
    props.onRightClick(event, item);
    cardMenu.value.show(event);
  }
};

</script>

<template>
  <!--  <ContextMenu v-if="menuItems" ref="cardMenu" :model="menuItems"/>-->

  <Carousel :index="index" :limitCardCountBy="limitCardCountBy" :title="title" class=""
    :type="!backdropCards ? 'backdrop' : 'poster'" :disableAutoAspect="!backdropCards">
    <template v-slot:link>
      <RouterLink v-if="moreLink" :to="moreLink"
        class="text-base text-slate-dark-9 dark:text-slate-light-9 flex items-center ml-auto mr-2">
        <span>{{ $t('See more') }}</span>
        <MoooomIcon icon="chevronRight" className="w-6 mt-1" />
      </RouterLink>
    </template>

    <template v-for="(item, itemIndex) in data" :key="item?.id">
      <swiper-slide v-if="item?.id" class="flex">
        <MediaCard :id="`item-${title}-${item.id}`" :data="item" :index="itemIndex"
          :onclick="() => handleClick(item as LibraryResponse | InfoResponse | HomeItem | ContinueWatching | Collection | KnownFor)"
          :watch="suffix == '/watch'" :disableAutoAspect="!backdropCards" :type="!backdropCards ? 'backdrop' : 'poster'"
          @contextmenu="onRightClick($event, item)" class="" />
      </swiper-slide>
    </template>
  </Carousel>
</template>
