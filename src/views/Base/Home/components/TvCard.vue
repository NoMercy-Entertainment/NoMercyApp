<script setup lang="ts">
import {RouterLink} from 'vue-router';

import {currentServer} from '@/store/currentServer';

defineProps({
  item: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },
  scrollToCenter: {
    type: Function,
    required: true,
  },
});

</script>

<template>
  <RouterLink :to="item.props.data.link.includes('watch') ? item.props.data.link : `${item.props.data.link}/watch`"
              v-if="item.props.data"
              :data-card="item.props.data"
              :index="index"
              @focus="scrollToCenter"
              class="flex flex-col justify-end relative items-center flex-grow-0 flex-shrink-0 w-full h-auto aspect-poster overflow-hidden rounded bg-cover bg-no-repeat bg-center  focus-visible:ring-2 focus-visible:ring-white snap-center pointer-events-auto mr-3 last:mr-0"
  >
    <img
        :src="`${currentServer?.serverBaseUrl}/images/original${item.props.data.poster}?width=300`"
        alt=""
        loading="lazy"
        class="w-full h-auto aspect-poster object-cover object-center absolute inset-0"
    >

    <div
        class="flex flex-col justify-end items-start self-stretch flex-grow-0 flex-shrink-0 h-[95px] relative overflow-hidden px-1.5 pt-10 pb-1.5"
        style="background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.24) 25.86%, rgba(0,0,0,0.9) 77.75%);"
    >
      <p
          class="self-stretch flex-grow-0 flex-shrink-0 w-full text-3xs font-bold text-left text-[#eeecec]"
      >
        {{ item.props.data.title }}
      </p>
      <p
          class="self-stretch flex-grow-0 flex-shrink-0 w-full text-[8px] text-left text-[#eff7ff]/[0.62]"
      >
        {{ item.props.data.year }}
      </p>
    </div>

  </RouterLink>
</template>

<style scoped>

</style>
