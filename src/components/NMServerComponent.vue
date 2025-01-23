<script setup lang="ts">
import { onMounted, ref, shallowRef, h, computed } from 'vue';
import { $t } from '@primeuix/styled';
import { currentServer } from '@/store/currentServer';

// @ts-ignore
window.h = h;

// Props
const props = defineProps({
  url: {
    type: String,
    required: true,
  },
});

// State variables
const dynamicComponent = shallowRef(null);
const loading = ref(true);
const url = computed(() => currentServer.value?.serverBaseUrl + '/transcode/' + props.url);

const loadComponent = async () => {
  try {
    const module = await import(/* @vite-ignore */ url.value);

    dynamicComponent.value = module.default;
  } catch (error) {
    console.error('Error loading component:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(loadComponent);

</script>

<template>
  <div>
    <component markRaw :is="dynamicComponent" v-if="dynamicComponent"></component>
    <p v-else-if="loading">{{ $t('Loading component') }}...</p>
    <p v-else>{{ $t('Failed to load component') }}.</p>
  </div>
</template>

<style scoped></style>
