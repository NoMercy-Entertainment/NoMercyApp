<script setup lang="ts">
import {type PropType} from 'vue';

import type {Genre} from '@/types/api/base/genre';

import {CollectionGenre} from '@/types/api/base/collection';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import {genreColors} from '@/config/global';
import router from '@/router';

defineProps({
  genre: {
    type: Object as PropType<Genre|CollectionGenre>,
    required: true
  }
});
</script>

<template>
  <button
      @click="router.push(`/genre/${genre?.id}`)"
        class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start rounded-2xl text-auto-1 dark:text-auto-12 px-2 py-0.5 hover:!grayscale-0"
        :class="genreColors(genre?.name).iconBg"
  >
    <MoooomIcon
        className="relative w-5 flex-shrink-0 flex-grow-0"
        :icon="genreColors(genre?.name).icon"
    />
    <div class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start gap-2 px-1">
      <p class="flex-shrink-0 flex-grow-0 text-center text-sm font-medium">
        {{ genre?.name }}
      </p>
    </div>
  </button>
</template>
