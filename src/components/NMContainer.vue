<script setup lang="ts">
import type {PropType} from 'vue';

import type {Component} from '@/lib/routerHelper';

defineProps({
  items: {
    type: Object as PropType<Component<any>[]> | undefined,
    required: true,
  },
});

</script>

<template>
  <div class="flex flex-col sm:flex-row gap-4 mx-2 my-4 sm:m-4 w-available">
    <component
        v-for="(render, index) in items ?? []"
        :index="index"
        :key="render.id"
        :is="render.component"
        v-bind="render.props"
    />
  </div>
</template>

<style scoped>

</style>
