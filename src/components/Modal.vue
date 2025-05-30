<script setup lang="ts">
import { PropType, ref, watch } from 'vue';

const open = defineModel('open', {
  type: Boolean,
  required: true,
  default: false,
});

const props = defineProps({
  close: {
    type: Function as PropType<(e: Event) => any>,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  params: {
    type: Object,
    required: false,
  },
  subTitle: {
    type: String,
    required: false,
  },
  maxWidth: {
    type: String,
    required: false,
    default: 'max-w-xl',
  },
  hidden: {
    type: Boolean,
    required: false,
    default: false
  }
});

</script>

<template>
  <Dialog :visible="open" :open="open" modal :header="$t(title, params)"
    class="w-full" :class="{
      [maxWidth]: true,
    }">
    <ScrollPanel class="w-available h-available" :dt="{
      bar: {
        background: 'rgb(var(--background-auto-12) / 60%)'
      }
    }">
      <template #default>
        <slot />
      </template>
    </ScrollPanel>

    <template #footer>
      <slot name="actions" />
    </template>
  </Dialog>
</template>
