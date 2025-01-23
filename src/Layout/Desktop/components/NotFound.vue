<script setup lang="ts">

defineProps({
  title: {
    type: String,
    default: '404',
    required: false,
  },
  description: {
    type: String,
    default: 'The content you are looking for does not exist.',
    required: false,
  }
});

const handleBack = () => {
  window.history.back();
};

</script>

<template>
  <div class="grid h-full w-full place-items-center">
    <div class="relative flex flex-col items-center justify-start gap-8 overflow-hidden">
      <div class="relative flex w-full flex-col gap-4">
        <p class="text-7xl font-bold text-center  text-slate-light-11 dark:text-slate-dark-11">
          {{ title }}
        </p>
        <p class="left-0 text-2xl text-center  text-slate-light-11 dark:text-slate-dark-11 whitespace-pre-line">
          {{ description }}
        </p>
      </div>
      <div class="h-6 w-full flex-shrink-0 flex-grow-0">
        <div class="h-6 w-full">
          <button @click="handleBack"
            class="absolute w-full text-base text-center  text-slate-light-11 dark:text-slate-dark-11 underline underline-offset-4">
            {{ $t('Back') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>