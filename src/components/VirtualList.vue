<template>
  <div class="virtual-list-container" v-if="items && items.length > 0">
    <VirtualScroller
      :items="items"
      :item-height="itemHeight"
      :container-height="containerHeight"
      :buffer="bufferSize || buffer || 5"
      :key-field="keyField"
      v-slot="{ item, index }"
    >
      <slot :item="item" :index="index" />
    </VirtualScroller>
  </div>
</template>

<script setup lang="ts">
import VirtualScroller from './VirtualScroller.vue';

interface Props {
  items?: any[] | null;
  itemHeight: number;
  containerHeight?: number;
  buffer?: number;
  bufferSize?: number; // Alternative name for buffer
  keyField?: string;
}

const props = withDefaults(defineProps<Props>(), {
  containerHeight: 600,
  buffer: 5,
  keyField: 'id'
});
</script>

<style scoped>
.virtual-list-container {
  width: 100%;
  overflow: hidden;
}
</style>
