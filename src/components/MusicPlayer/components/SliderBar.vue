<script setup lang="ts">

import { computed, PropType } from 'vue';

const props = defineProps({
  position: {
    type: Number,
    required: true,
  },
  percentage: {
    required: true,
  },
  min: {
    type: Number,
    required: false,
    default: 0,
  },
  max: {
    type: Number,
    required: false,
    default: 100,
  },
  step: {
    type: Number,
    required: false,
    default: 1,
  },
  onKeyDown: {
    type: Function as PropType<(event: KeyboardEvent) => void>,
    required: false,
  },
  onKeyUp: {
    type: Function as PropType<(event: KeyboardEvent) => void>,
    required: false,
  },
});

defineEmits(['update:modelValue']);

const computedPercentage = computed(() => {
  const value = ((props.position - props.min) / (props.max - props.min)) * 100 + 1;
  return Number.isNaN(value) ? 0 : value
});

</script>

<template>
  <span class="sliderBar h-2 w-full rounded-full group relative"
    style="box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.24) inset, 0 -1px 0 0 rgba(255, 255, 255, 0.12) inset, 0 4px 4px 0 rgba(0, 0, 0, 0.08) inset;">
    <input id="slider" type="range" :step="step" :min="min" :max="max" @keydown="onKeyDown && onKeyDown($event)"
      @keyup="onKeyUp && onKeyUp($event)" class="relative w-full
        [&::-webkit-slider-runnable-track]:transition-all 
        [&::-webkit-slider-runnable-track]:duration-100
        [&::-webkit-slider-thumb]:opacity-0
        [&::-moz-slider-thumb]:opacity-0
        group-hover:[&::-webkit-slider-thumb]:opacity-100
        group-hover:[&::-moz-slider-thumb]:opacity-100
        focus-visible:[&::-webkit-slider-thumb]:opacity-100
        focus-visible:[&::-moz-slider-thumb]:opacity-100
        focus-visible:!outline
        focus-visible:!outline-solid
        focus-visible:!outline-white
      " :value="position" :style="{ '--left': `${computedPercentage}%` }"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" name="slider">
  </span>
</template>
