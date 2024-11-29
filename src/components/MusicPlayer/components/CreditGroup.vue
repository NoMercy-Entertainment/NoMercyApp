<script lang="ts" setup>
import {type PropType} from 'vue';
import {useTranslation} from 'i18next-vue';

import type {KnownFor} from "@/types/api/base/person";
import type {Crew} from "@/types/api/shared";

import MoooomIcon from "@/components/Images/icons/MoooomIcon.vue";

defineProps({
  items: {
    type: Array as PropType<Array<KnownFor | Crew> | undefined>,
    required: false,
  },
  title: {
    type: String as PropType<string>,
    required: true,
  },
});

const {t} = useTranslation();

</script>

<template>
  <div v-if="items && items?.length > 0"
       class="relative flex w-full flex-col items-start justify-start gap-2">
    <p class="text-left text-xl font-bold text-contrast">
      {{ t(title) }}
    </p>
    <div class="flex w-full flex-col items-start justify-start">
      <div v-for="item in items"
           :key="item?.id"
           class="grid w-available relative gap-4 py-4 border-t-0 border-r-0 border-b border-l-0 border-white/4 overflow-hidden grid-cols-[[year]_5ch_[title]_minmax(auto,max-content)_[buttons]_11ch] group/credit">
        <p class="w-10 text-sm font-bold text-auto">
          {{ item.year == 0 ? '—' : item.year }}
        </p>
        <div class="relative flex w-fit flex-wrap items-center justify-start gap-2">
          <RouterLink :to="item.link"
                class="text-left text-sm font-bold text-contrast hover:underline">
            {{ item.title ?? item.name }}
          </RouterLink>
          <p v-if="(item as KnownFor)?.episode_count"
             class="text-left text-sm text-contrast/60">
            ({{ (item as KnownFor)?.episode_count }} {{
              (item as KnownFor).episode_count! > 2
                  ? t('episodes')
                  : t('episode')
            }})
          </p>
          <div v-if="(item.character ?? item.job)"
               class="flex w-fit flex-nowrap gap-2">
            <p class="text-left text-sm text-contrast/60">
              {{ t('as') }}
            </p>
            <p class="flex w-fit flex-wrap gap-1 text-sm text-contrast">
              <span v-for="(role, index) in (item.character ?? item.job)?.split(' / ')">
                {{ role.replace('(voice)', '') }}{{ index < (item.character ?? item.job ?? '')?.split(' / ').length - 1 ? ', ' : '' }}
              </span>
            </p>
          </div>
        </div>
        <div v-if="(item as KnownFor)?.hasItem"
             class="relative flex h-7 w-max cursor-pointer items-center justify-center gap-1 rounded-2xl p-2 pr-3 bg-auto-6/5 transition-transform duration-300 group-hover/credit:bg-auto-6/9 hover:!bg-auto-6/12">
          <MoooomIcon icon="playCircle" className="h-4 w-4"/>
          <RouterLink :to="item.link"
                class="text-center text-xs font-medium text-theme-11 translate-y-[1px] group-hover/credit:text-theme-400">
            {{ t('Watch now') }}
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
