<script setup lang="ts">
import { ref, PropType } from 'vue';
import {useRoute} from "vue-router";
import MoooomIcon from "@/components/Images/icons/MoooomIcon.vue";
import MusicButton from "@/components/MusicPlayer/components/MusicButton.vue";

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

const props = defineProps({
  shareData: {
    type: Object as PropType<ShareData>,
    required: false,
  },
  fallbackText: {
    type: String,
    required: false,
    default: 'Share'
  }
});

const isSupported = ref(!!navigator.share);
const isCopied = ref(false);
const route = useRoute();

const share = async () => {
  // Default to current page if no shareData provided
  const dataToShare: ShareData = props.shareData ?? {
    title: document.title,
    text: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '',
    url: route.fullPath
  };

  try {
    if (isSupported.value) {
      await navigator.share(dataToShare);
    } else {
      // Fallback to copying URL to clipboard
      const textToCopy = dataToShare.url ?? route.fullPath;
      await navigator.clipboard.writeText(textToCopy);
      isCopied.value = true;
      setTimeout(() => {
        isCopied.value = false;
      }, 2000);
    }
  } catch (error) {
    console.error('Error sharing:', error);
  }
};
</script>

<template>
  <MusicButton :onclick="share" label="Share">
    <MoooomIcon v-if="!isSupported && isCopied" icon="shareSquare" class="" />
    <MoooomIcon v-else icon="shareSquare" class="" />
  </MusicButton>
</template>

<style scoped>

</style>