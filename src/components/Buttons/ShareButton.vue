<script setup lang="ts">
import { ref, PropType } from 'vue';
import {useRoute} from "vue-router";
import { Share, type ShareOptions } from '@capacitor/share';

import OptimizedIcon from "@/components/OptimizedIcon.vue";
import MusicButton from "@/components/MusicPlayer/components/MusicButton.vue";
import {useTranslation} from "i18next-vue";

const props = defineProps({
  shareData: {
    type: Object as PropType<ShareOptions>,
    required: false,
  },
  fallbackText: {
    type: String,
    required: false,
    default: 'Share'
  }
});

const route = useRoute();
const { t } = useTranslation();

const isCopied = ref(false);

const share = async () => {
  await Share.share(props.shareData ?? {
    title: document.title,
    text: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
    url: 'https://app.nomercy.tv' + route.fullPath,
    dialogTitle: t('Share with buddies'),
  })
    .then(() => {
      isCopied.value = true;
      setTimeout(() => {
        isCopied.value = false;
      }, 2000);
    })
    .catch((error) => {
      console.error('Share failed:', error);
      alert(props.fallbackText);
    });
};
</script>

<template>  <MusicButton :onclick="share" label="Share">
    <OptimizedIcon v-if="isCopied" icon="shareSquare" class="" />
    <OptimizedIcon v-else icon="shareSquare" class="" />
  </MusicButton>
</template>

<style scoped>

</style>