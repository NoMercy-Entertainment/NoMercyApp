<script setup lang="ts">

import {computed, onMounted, PropType, ref, watch} from 'vue';

import type {PaletteColors} from '@/types/api/shared';

import {isPlatform} from '@ionic/vue';
import {getImageBrightness, hexLighter} from '@/lib/colorHelper';
import {useMediaQuery} from '@vueuse/core';
import currentServer from '@/store/currentServer';
import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';
import {useAutoThemeColors} from '@/store/preferences';

const props = defineProps({
  path: {
    type: String as PropType<string | null | undefined>,
    required: false,
  },
  colorPalette: {
    type: Object as PropType<PaletteColors | undefined>,
    required: false,
  },
  title: {
    type: String as PropType<string | null | undefined>,
    required: false,
  },
  className: {
    type: String as PropType<string | undefined>,
    required: false,
  },
  size: {
    type: Number as PropType<number>,
    required: false,
  },
  aspect: {
    type: String as PropType<'poster' | 'backdrop'>,
    required: false,
  },
  type: {
    type: String as PropType<'image' | 'logo'>,
    required: false,
    default: 'image',
  },
  disableGradient: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  autoShadow: {
    type: Boolean as PropType<boolean>,
    required: false,
    default: false,
  },
  loading: {
    type: String as PropType<'lazy' | 'eager'>,
    required: false,
    default: 'lazy',
  },
  priority: {
    type: String as PropType<'high' | 'low' | 'auto'>,
    required: false,
    default: 'low',
  },
  shadow: {
    type: String,
    required: false,
    default: 'white',
  },
});

const opacity = ref(0);
const error = ref(false);
const shouldLighten = ref(false);
const shouldDarken = ref(false);
const brightness = ref(0);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const onError = (e: Event) => {
  (e.target as HTMLImageElement).onerror = null;
  error.value = true;
};

const baseImageUrl = computed(() => {
  if (!props.path) return;
  return `${currentServer.value?.serverBaseUrl}/images/original${props.path}`;
});

onMounted(() => {
  if (props?.type != 'logo') return;

  getImageBrightness(`${baseImageUrl.value}`, ({nonTransparentBrightness}) => {
    brightness.value = nonTransparentBrightness;
    shouldLighten.value = nonTransparentBrightness < 20;
    shouldDarken.value = nonTransparentBrightness > 80;
  });
});

watch(baseImageUrl, (value) => {
  if (!value) return;

  if (props?.type == 'logo') return;

  getImageBrightness(`${value}`, ({nonTransparentBrightness}) => {
    brightness.value = nonTransparentBrightness;
    shouldLighten.value = nonTransparentBrightness < 20;
    shouldDarken.value = nonTransparentBrightness > 80;
  });

  error.value = false;
});

const onLoad = () => {
  opacity.value = 1;
};

const onLoadStart = () => {
  opacity.value = 0;
};

const isDarkMode = computed(() => {
  const classList = (document.body.parentElement as HTMLElement).classList;
  if (!classList.contains('scheme-dark') && !classList.contains('scheme-light')) {
    return useMediaQuery('(prefers-color-scheme: dark)');
  }
  return classList.contains('scheme-dark');
});

const luminosityValue = computed(() => {
  return isDarkMode.value ? 20 : 30;
});

const style = computed(() => {
  return {
    '--c-1': 'rgb(var(--color-focus))',
    '--c-2': 'rgb(var(--color-focus) / 3%)',
    '--c-3': 'rgb(var(--color-focus) / 14%)',
    '--c-4': 'rgb(var(--color-focus) / 1%)',

    backgroundImage: props.type == 'logo' || props.disableGradient || !useAutoThemeColors
        ? props.type == 'logo' || props.disableGradient
            ? ''
            : `
                    radial-gradient(
                        farthest-corner at top left,
                                rgb(var(--color-theme-9)),
                                hsl(0 0% 100% / 4%) 300px
                            ),
                            radial-gradient(
                                farthest-corner at top right,
                                rgb(var(--color-theme-2)),
                                hsl(0 0% 100% / 4%) 300px
                            ),
                            radial-gradient(
                                farthest-corner at bottom left,
                                rgb(var(--color-theme-6)),
                                hsl(0 0% 100% / 4%)
                            ),
                            radial-gradient(
                                farthest-corner at bottom right,
                                rgb(var(--color-theme-12)),
                        hsl(0 0% 100% / 4%) 300px
                    )
                `
        : `
				radial-gradient(
					farthest-corner at top left,
							${hexLighter(props.colorPalette?.lightVibrant, luminosityValue.value) ?? 'var(--c-1)'},
							hsl(0 0% 100% / 4%) 300px
						),
						radial-gradient(
							farthest-corner at top right,
							${hexLighter(props.colorPalette?.dominant, luminosityValue.value) ?? 'var(--c-2)'},
							hsl(0 0% 100% / 4%) 300px
						),
						radial-gradient(
							farthest-corner at bottom left,
							${hexLighter(props.colorPalette?.darkVibrant, luminosityValue.value) ?? 'var(--c-3)'},
							hsl(0 0% 100% / 4%)
						),
						radial-gradient(
							farthest-corner at bottom right,
							${hexLighter(props.colorPalette?.dominant, luminosityValue.value) ?? 'var(--c-4)'},
					hsl(0 0% 100% / 4%) 300px
				)
			`,
  };
});

const remove = (e: ErrorEvent) => {
  if ((e.target as HTMLImageElement)?.parentNode?.children?.length ?? 0 > 1) {
    (e.target as HTMLImageElement)?.parentNode?.children[0].remove();
  }
  (e.target as HTMLImageElement).src = `https://image.tmdb.org/t/p/original${props.path}`;
};

const aspectRatio = computed(() => {
  return props.aspect == 'poster'
      ? 3 / 2
      : props.aspect == 'backdrop'
          ? 9 / 16
          : null;
});

const widthClass = computed(() => {
  return props.aspect == 'poster' || props.aspect == 'backdrop'
      ? 'w-full'
      : 'w-auto';
});

const height = computed(() => {
  if (!props.size || !aspectRatio.value) return 0;
  return props.size * aspectRatio.value;
});

</script>

<template>
  <div class="pointer-events-none bottom-0 mx-auto flex w-full select-none place-self-start overflow-hidden h-available"
       :class="aspect == 'poster'
        ? ' aspect-poster'
        : aspect == 'backdrop'
          ? ' aspect-backdrop'
          : ' '"
       :style="style">
    <div class="absolute inset-0 h-full w-full animate-pulse bg-black/50 shadow"
         v-if="opacity == 0 && type == 'image'"></div>
    <picture v-if="!error && path && !path?.includes?.('undefined')"
             class="pointer-events-none absolute inset-0 flex select-none flex-col items-end justify-end self-end transition-all duration-500"
             :class="aspect == 'poster'
                ? ' aspect-poster  w-available h-auto'
                : aspect == 'backdrop'
                  ? ' aspect-backdrop  w-available h-auto'
                  : 'w-auto h-available'"
             :style="`opacity: ${opacity}; float: ${type == 'logo'? 'right' : ''}`">
      <!--			<source-->
      <!--				:srcset="`${baseImageUrl}?width=${size ? (size * 2) : null}&type=avif&aspect_ratio=${aspectRatio} 1x`"-->
      <!--				type="image/avif"-->
      <!--			/>-->
      <!--			<source-->
      <!--				:srcset="`${baseImageUrl}?width=${size ? (size * 2) : null}&type=webp&aspect_ratio=${aspectRatio} 1x`"-->
      <!--				type="image/webp"-->
      <!--			/>-->
      <!--			<source-->
      <!--				:srcset="`${baseImageUrl}?width=${size ? (size * 2) : null}&type=jpg&aspect_ratio=${aspectRatio} 1x`"-->
      <!--				type="image/jpeg"-->
      <!--			/>-->
      <img :src="baseImageUrl"
           :width="size"
           :height="height"
           :fetchpriority="priority"
           :loading="isPlatform('tablet') || loading == 'eager' ? 'eager' : 'lazy'"
           :alt="`tmdb image for ${title ?? 'image'}`"
           class="pointer-events-auto inset-0 h-auto bg-top transition-all duration-500 max-h-available"
           :class="`
						${className}
						${widthClass}
						${type == 'logo' ? 'object-scale-down' : 'object-cover'}
						${shouldDarken
                 ? `[filter:drop-shadow(0px_0px_6px_black)_drop-shadow(0px_0px_6px_black)_drop-shadow(0px_0px_6px_black)]`
                 : ''
					}`"
           :style="`
            float: ${type == 'logo' ? 'right' : ''};
            filter: ${shouldLighten || shouldDarken
              ? `drop-shadow(0px 0px 6px rgb(${shadow})) drop-shadow(0px 0px 6px rgb(${shadow}))`
              : ''
            }`"
           :onload="onLoad"
           :onloadstart="onLoadStart"
           :onerror="remove"
           crossorigin="anonymous"/>
    </picture>
    <div v-if="error || (!path && type == 'image')"
         class="inset-0 grid aspect-video h-full w-full place-items-center p-2 place-center"
         :class="type == 'image' ? 'bg-auto-1' : ''">
      <div
          class="w-full h-full inset-0 grid place-items-center place-center bg-[rgb(var(--color-logo-dark)/20%)]">
        <AppLogoSquare class="h-auto w-3/5 max-h-[60%] -translate-y-[5%]"/>
      </div>
    </div>
  </div>
</template>
