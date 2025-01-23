<script setup lang="ts">
import { ref, watch } from "vue";
import { refDebounced } from "@vueuse/core";

import { deviceName, setDeviceName } from "@/store/deviceInfo";

const name = ref(deviceName.value);
const debouncedName = refDebounced(name, 1000);
watch(debouncedName, (value) => {
  setDeviceName(value);
});
</script>

<template>
  <div class="xl:col-start-1 2xl:col-span-2 2xl:col-start-1">
    <div class="flex flex-col gap-2">
      <label for="name">{{ $t('Device name') }}</label>
      <InputText id="name" v-model="name" class="mb-4 w-full" placeholder="..." />
    </div>
  </div>
</template>
