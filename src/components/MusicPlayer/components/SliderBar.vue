<script setup lang="ts">

defineProps({
  position: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
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

</script>

<template>
  <span class="h-2 w-full rounded-full group">
  <input
      id="slider"
      type="range"
      :step="step"
      :min="min"
      :max="max"
      class="relative flex h-2 w-full cursor-pointer appearance-none rounded-full bg-gradient-to-r accent-focus [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-thumb]:opacity-0 [&::-moz-slider-thumb]:opacity-0 group-hover:[&::-webkit-slider-thumb]:opacity-100 group-hover:[&::-moz-slider-thumb]:opacity-100 [&::-webkit-slider-thumb]:transition-all [&::-moz-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-100 [&::-moz-slider-thumb]:duration-100"
      style="
        background-color: rgb(var(--color-focus, var(--color-theme-9)));
        background-image: -webkit-gradient(linear, left top, right top, color-stop(var(--left), rgb(var(--color-focus, var(--color-theme-9)))), color-stop(var(--left), #ffffffff))
      "
      :model-value="position"
      :value="position"
      :style="{ '--left': `${percentage + 1}%` }"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      name="slider">
  </span>
</template>
