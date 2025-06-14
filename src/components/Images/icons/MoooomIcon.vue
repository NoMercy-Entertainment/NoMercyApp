<script setup lang="ts">
import { computed, ref, watchEffect, type PropType } from "vue";
import { twMerge } from "tailwind-merge";
import { MoooomIcons } from '@Icons/icons';
import { ExtractedMoooomIcons } from '@Icons/mooooom/index';
import { getMoooomIcon } from '@Icons/index';

// Import sprite as fallback
import icons from '/resources/mooooom-icons.svg';

const props = defineProps({
  icon: {
    type: String as PropType<keyof typeof MoooomIcons>,
    required: true,
  },
  className: {
    type: String,
    required: false,
    default: '',
  },
});

// Check if icon is extracted (optimized)
const isExtractedIcon = computed(() => {
  return Object.prototype.hasOwnProperty.call(ExtractedMoooomIcons, props.icon);
});

// State for optimized loading
const iconContent = ref<string>('');
const useSprite = ref(!isExtractedIcon.value);
const isLoading = ref(false);

// Load optimized icon or fallback to sprite
watchEffect(async () => {
  if (isExtractedIcon.value) {
    try {
      isLoading.value = true;
      iconContent.value = await getMoooomIcon(props.icon);
      useSprite.value = false;
    } catch (error) {
      // Fallback to sprite on error
      console.warn(`Failed to load optimized icon "${props.icon}", falling back to sprite:`, error);
      useSprite.value = true;
    } finally {
      isLoading.value = false;
    }
  } else {
    // Use sprite for non-extracted icons
    useSprite.value = true;
  }
});

const classes = computed(() => 
  twMerge('w-6 h-auto aspect-square flex-shrink-0 flex pointer-events-none', props.className)
);
</script>

<template>
  <!-- Optimized individual SVG for extracted icons -->
  <div 
    v-if="!useSprite && iconContent"
    v-html="iconContent" 
    :class="classes"
  />
  
  <!-- Fallback to sprite for non-extracted icons -->
  <svg v-else :class="classes">
    <use :xlink:href="`${icons}#${icon}`"></use>
  </svg>
</template>
