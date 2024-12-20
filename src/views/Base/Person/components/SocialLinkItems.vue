<script setup lang="ts">

import SpriteIcon from "@/components/Images/icons/SpriteIcon.vue";
import {PropType} from "vue";
import type {PersonResponseItem} from "@/types/api/base/person";

defineProps({
  data: {
    type: Object as PropType<PersonResponseItem>,
    required: true,
  },
});

</script>

<template>

  <div v-if="data?.external_ids"
       class="flex flex-col gap-1 justify-center items-start w-available"
  >
    <p class="text-xs font-bold uppercase text-auto-alpha-10">
      {{ $t('Links') }}
    </p>
    <div class="flex flex-row flex-wrap w-available items-center gap-2 -mx-2">
      <a :href="`https://www.themoviedb.org/person/${data?.id}`"
         class="relative flex items-center justify-center overflow-hidden h-9 p-1.5 px-2"
         target="_blank">
        <SpriteIcon icon="tmdb" class="!w-12"/>
      </a>
      <a v-if="data?.external_ids?.facebook_id"
         :href="`https://www.facebook.com/${data?.external_ids.facebook_id}`"
         class="relative flex items-center justify-center overflow-hidden p-1.5"
         target="_blank">
        <SpriteIcon icon="facebook" class="w-6"/>
      </a>
      <a v-if="data?.external_ids?.twitter_id"
         :href="`https://twitter.com/${data?.external_ids?.twitter_id}`"
         class="relative flex items-center justify-center overflow-hidden p-1.5"
         target="_blank">
        <SpriteIcon icon="twitter" class="w-6"/>
      </a>
      <a v-if="data?.external_ids?.instagram_id"
         :href="`https://instagram.com/${data?.external_ids?.instagram_id}`"
         class="relative flex items-center justify-center overflow-hidden p-1.5"
         target="_blank">
        <SpriteIcon icon="instagram" class="w-6"/>
      </a>
      <a v-if="data?.external_ids?.youtube_id"
         :href="`https://youtube.com/channel/${data?.external_ids?.youtube_id}`"
         class="relative flex items-center justify-center overflow-hidden p-1.5"
         target="_blank">
        <SpriteIcon icon="youtube" class="w-6"/>
      </a>
      <a v-if="data?.external_ids?.tiktok_id"
         :href="`https://tiktok.com/@${data?.external_ids?.tiktok_id}`"
         class="relative flex items-center justify-center overflow-hidden p-1.5"
         target="_blank">
        <SpriteIcon icon="tiktok" class="w-6"/>
      </a>
      <a v-if="data?.external_ids?.imdb_id"
         :href="`https://www.imdb.com/name/${data?.external_ids?.imdb_id}`"
         class="relative flex items-center justify-center overflow-hidden p-1.5"
         target="_blank">
        <SpriteIcon icon="imdb" class="w-6"/>
      </a>
      <a v-if="data?.external_ids?.wikidata_id"
         :href="`https://www.wikidata.org/wiki/${data?.external_ids?.wikidata_id}`"
         class="relative flex items-center justify-center overflow-hidden p-1.5"
         target="_blank">
        <SpriteIcon icon="wikipedia" class="w-6"/>
      </a>
    </div>
  </div>
  <div class="self-stretch h-px bg-[#05294d]/[0.08] dark:bg-[#e2f0fd]/[0.08]"></div>

</template>

<style scoped>

</style>