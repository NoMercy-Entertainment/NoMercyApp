<script lang="ts" setup>
import { type PropType } from 'vue';
import { useTranslation } from 'i18next-vue';
import { IonList, IonItem } from '@ionic/vue';

import type { KnownFor } from "@/types/api/base/person";
import type { Crew } from "@/types/api/shared";

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

const { t } = useTranslation();

</script>

<template>
  <div v-if="items && items?.length > 0"
    class="relative flex w-available flex-col items-start justify-start gap-2 -mx-3">
    <p class="text-left text-xl font-bold ml-4">
      {{ t(title) }}
    </p>

    <ion-list lines="inset" class="w-available">
      <ion-item v-for="item in items" :key="item?.id">
        <div class="grid w-available py-1 items-center relative gap-4 overflow-clip group/credit" :class="{
          'grid-cols-[[year]_5ch_[title]_minmax(auto,100%)_[buttons]_5ch]': (item as KnownFor)?.hasItem,
          'grid-cols-[[year]_5ch_[title]_minmax(auto,100%)]': !(item as KnownFor)?.hasItem,
        }">

          <p class="w-10 text-base font-bold text-auto self-start whitespace-nowrap">

            {{ item.year == 0 ? '—' : item.year }}
          </p>

          <div
            class="relative flex flex-col sm:w-fit flex-wrap items-start justify-between gap-1 w-inherit overflow-clip">
            <RouterLink :to="item.link"
              class="text-left text-base font-semibold hover:underline line-clamp-2">
              {{ item.title ?? item.name }}
            </RouterLink>

            <div v-if="(item.character ?? item.job)"
              class="flex w-auto sm:w-fit flex-nowrap gap-1 font-normal text-left text-xs">

              <p v-if="(item as KnownFor)?.episode_count" class="text-contrast/60 whitespace-nowrap">
                ({{ (item as KnownFor)?.episode_count }} {{
                  (item as KnownFor).episode_count! > 2
                    ? t('ep')
                    : t('ep')
                }})
              </p>

              <p class="text-contrast/60">
                {{ t('as') }}
              </p>

              <p class="flex w-fit flex-wrap gap-1 text-sm whitespace-nowrap font-medium">
                <template v-for="(role, index) in (item.character ?? item.job)?.split(' / ')">
                  {{
                    role.replace('(voice)', '')
                  }}{{ index < (item.character ?? item.job ?? '')?.split(' / ').length - 1 ? ' , ' : '' }}
                </template>
</p>
</div>
</div>

<RouterLink :to="item.link" v-if="(item as KnownFor)?.hasItem"
  class="relative flex items-center justify-center gap-2 rounded-lg p-2 aspect-square transition-colors duration-300 group/play hover:bg-auto-5/6">
  <MoooomIcon icon="play" className="h-5 w-5" />
</RouterLink>
</div>
</ion-item>
</ion-list>
</div>
</template>

<style scoped>
ion-list {
  --ion-item-background: transparent;
}

ion-item::part(native) {
  --background: transparent;
}
</style>