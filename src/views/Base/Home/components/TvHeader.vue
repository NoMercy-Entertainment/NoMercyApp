<script setup lang="ts">
import { type PropType } from "vue";

import type { ContinueWatching, HomeItem } from "@/types/api/base/home";

import ContentRating from "@/components/Images/ContentRating.vue";
import TMDBImage from "@/components/Images/TMDBImage.vue";

defineProps({
  selected: {
    type: Object as PropType<ContinueWatching | HomeItem | null>,
    required: false,
  },
});
</script>

<template>
  <div class="w-full h-full absolute left-0 top-0 bg-[#131314]" :key="selected?.id">
    <div class="w-available h-available absolute left-[202px] top-0 overflow-hidden bg-black">
      <TMDBImage
        class="w-available h-available absolute left-[-0.39px] top-[-0.39px] object-cover"
        :path="selected?.backdrop"
        :size="1080"
        :alt="selected?.title" />
<!--      <img class="w-available h-available absolute left-[-0.39px] top-[-0.39px] object-cover"-->
<!--        :src="`${currentServer?.serverBaseUrl}/images/original${selected?.backdrop}?width=1920`" alt="" />-->
      <div class="w-available h-available absolute left-[-0.39px] top-[-0.39px]"></div>
      <div class="w-[150vw] h-[150vw] absolute left-[-30%] bottom-[-50%]" style="
                  background: radial-gradient(
                    closest-side,
                    rgba(19, 19, 20, 0.1) 0%,
                    rgba(19, 19, 20, 1) 70.73974609375%
                  );
              "></div>
    </div>
    <div class="flex flex-col justify-start items-start w-[484px] relative left-[58px] top-20 gap-7">
      <div class="flex flex-col justify-start items-start self-stretch relative gap-5">
        <div class="flex flex-col justify-start items-start w-full relative gap-0">
          <div
            class="flex items-center h-8 gap-2 self-stretch w-full opacity-60 text-xs font-medium text-left text-[#c4c7c5]">
            <ContentRating v-if="selected?.content_ratings" :size="8" :ratings="selected?.content_ratings" />
            <span class="flex gap-2" v-if="selected?.year">
              <span>•</span>
              <span>{{ selected?.year }}</span>
            </span>
            <span class="flex gap-2" v-if="selected?.have_items ?? 0 > 1">
              <span>•</span>
              <span>{{ selected?.have_items }} {{ selected?.have_items ? $t('Episodes') : '' }}</span>
            </span>
          </div>

          <p class="self-stretch w-full text-xl text-left mt-2">
            {{ selected?.title }}
          </p>
        </div>
        <div class="line-clamp-4 text-sm -mt-4">
          {{ selected?.overview }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>