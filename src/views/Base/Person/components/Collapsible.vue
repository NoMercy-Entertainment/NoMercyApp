<script setup lang="ts">

import { IonSkeletonText } from "@ionic/vue";

import { PropType, ref } from "vue";
import type { PersonResponseItem } from "@/types/api/base/person";

defineProps({
  text: {
    type: String,
    required: false,
  },
  maxLines: {
    type: Number,
    default: 3,
  },
});

const showMore = ref(false);


</script>

<template>
  <div v-if="text" class="flex flex-col relative justify-start items-start self-stretch gap-1">
    <p class="self-stretch relative w-inherit text-sm leading-5 font-medium text-left min-h-[3.5rem] transition-all duration-300 overflow-hidden text-balance whitespace-pre"
      :class="{
        [`max-h-[3.5rem] h-[3.5rem] line-clamp-3`]: (text?.length ?? 0) > 180 && !showMore,
        [`max-h-available h-auto line-clamp-none after:content-['']`]: showMore,
        [`-webkit-line-clamp: ${maxLines};`]: true
      }" ref="overview">
      {{ text?.replace(/(\w{2,})\.\s/gu, '$1.\n') ?? '&nbsp;' }}
    </p>
    <div v-if="(text?.length ?? 0) > 180"
      class="flex flex-col justify-center items-center h-5 relative overflow-hidden gap-2">
      <button @click="showMore = !showMore"
        class="flex-grow-0 flex-shrink-0 text-sm font-medium text-left underline underline-offset-2">
        <span v-if="!showMore">{{ $t('Read more') }}</span>
        <span v-else>{{ $t('Read less') }}</span>
      </button>
    </div>
  </div>
  <ion-skeleton-text v-else :animated="true" class="h-[4.55rem] will-change-auto"></ion-skeleton-text>
  <div class="self-stretch h-px bg-[#05294d]/[0.08] dark:bg-[#e2f0fd]/[0.08]"></div>
</template>

<style scoped></style>