<script setup lang='ts'>
import {PropType, watch} from "vue";
import {useLocalStorage} from "@vueuse/core";

import {defaultSubtitleStyles, SubtitleStyle} from "@/types/config";

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

const colors: {title:string, color:string}[] = [
  {
    title: 'Black',
    color: 'black'
  },
  {
    title: 'Blue',
    color: 'blue'
  },
  {
    title: 'Green',
    color: 'green'
  },
  {
    title: 'Cyan',
    color: 'cyan'
  },
  {
    title: 'Red',
    color: 'red'
  },
  {
    title: 'Magenta',
    color: 'magenta'
  },
  {
    title: 'Yellow',
    color: 'yellow'
  },
  {
    title: 'White',
    color: 'white'
  },
];

</script>

<template>
	<div class="flex select-none flex-col gap-3">
		<p class="font-bold">{{ $t(title) }}</p>
		<div class="flex flex-row gap-2">
			<div class="relative flex flex-wrap gap-2">
        <template v-for="color in colors" :key="color.title">
          <ColorButton :color="color" :currentColor="currentStyle[type]" :setCurrentColor="setCurrentColor" />
        </template>
			</div>
		</div>
	</div>
</template>
