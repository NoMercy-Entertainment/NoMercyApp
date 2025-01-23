<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import md5 from 'md5';
import { computed } from 'vue';

const { t } = useTranslation();

defineProps({
  height: {
    type: Number,
    default: 40,
  },
  width: {
    type: Number,
    default: 40,
  },
  size: {
    type: Number,
    default: 400,
  },
  className: {
    type: String,
    default: '',
  },
  email: {
    type: String,
    required: true,
  },
  cache: {
    type: Number,
    default: 1,
  },
});

const suffix = location.hostname.includes('dev') ? '-dev' : '';
const baseUrl = computed(() => `https://cdn${suffix}.nomercy.tv`);

</script>

<template v-once>
  <div
    class="relative flex aspect-square flex-shrink-0 flex-grow-0 flex-col items-start justify-start self-stretch overflow-hidden rounded-lg bg-black"
    :class="className">
    <div class="absolute h-full">
      <img :alt="`${t('NoMercyAvatar for')} ${email}`"
        :src="`${baseUrl}/avatar/${md5(email)}?cache=${cache}&d=monsterid&fm=webp&r=pg&s=${size}&w=${size}`"
        :srcset="`${baseUrl}/avatar/${md5(email)}?cache=${cache}&d=monsterid&fm=webp&r=pg&s=${size * 2}&w=${size * 2}`"
        :height="size ?? height" :width="size ?? width" cachekey="0" crossorigin="anonymous"
        class="h-full object-cover NoMercyAvatar" />
    </div>
  </div>
</template>
