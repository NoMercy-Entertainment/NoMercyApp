<script setup lang='ts'>
import {type PropType} from "vue";
import {useLocalStorage} from "@vueuse/core";

import type {SubtitleStyle} from "@nomercy-entertainment/nomercy-video-player/src/types";
import {defaultSubtitleStyles, colors} from "@/lib/VideoPlayer/plugins/UIPlugin/buttons";

import ColorButton from "./ColorButton.vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  type:{
    type: String as PropType<keyof SubtitleStyle>,
    required: true,
  }
});

const currentStyle = useLocalStorage<SubtitleStyle>('nmplayer-subtitle-style', defaultSubtitleStyles);

const setCurrentColor = (color: string) => {
  currentStyle.value = {
    ...currentStyle.value,
    [props.type]: color
  };
}

</script>

<template>
	<div class="flex select-none flex-col gap-3">
		<p class="font-bold">{{ $t(title) }}</p>
		<div class="flex flex-row gap-2">
			<div class="relative flex flex-wrap gap-2">
        <template v-for="color in colors" :key="color.label">
          <ColorButton :color="color" :currentColor="currentStyle[type]" :setCurrentColor="setCurrentColor" />
        </template>
			</div>
		</div>
	</div>
</template>
