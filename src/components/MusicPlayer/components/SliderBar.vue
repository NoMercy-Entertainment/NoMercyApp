<script setup lang="ts">

import {computed} from 'vue';

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
});

defineEmits(['update:modelValue']);

const computedPercentage = computed(() => {
  const value = ((props.position - props.min) / (props.max - props.min)) * 100 + 1;
  return Number.isNaN(value) ? 0 : value
});

</script>

<template>
  <span class="h-2 w-full rounded-full group"
        style="box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.24) inset, 0 -1px 0 0 rgba(255, 255, 255, 0.12) inset, 0 4px 4px 0 rgba(0, 0, 0, 0.08) inset;"
        >
  <input
      id="slider"
      type="range"
      :step="step"
      :min="min"
      :max="max"
      class="relative flex h-2 w-full cursor-pointer appearance-none rounded-full accent-focus [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-thumb]:opacity-0 [&::-moz-slider-thumb]:opacity-0 group-hover:[&::-webkit-slider-thumb]:opacity-100 group-hover:[&::-moz-slider-thumb]:opacity-100 [&::-webkit-slider-thumb]:transition-all [&::-moz-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-100 [&::-moz-slider-thumb]:duration-100 [background-image:_-webkit-gradient(linear,_left_top,_right_top,_color-stop(var(--left),_rgb(var(--color-focus,_var(--color-theme-7)))),_color-stop(var(--left),_#00000080))] dark:[background-image:_-webkit-gradient(linear,_left_top,_right_top,_color-stop(var(--left),_rgb(var(--color-focus,_var(--color-theme-9)))),_color-stop(var(--left),_#ffffff80))] bg-focus"
      :value="position"
      :style="{ '--left': `${computedPercentage}%` }"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      name="slider">
  </span>
</template>
