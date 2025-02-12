<script lang="ts" setup>
import { computed, type PropType } from 'vue';
import { useTranslation } from 'i18next-vue';

import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

import type { LogEntry } from "@/types/server";

import { userTime } from "@/lib/dateTime";
import { censorPublicIpAddresses } from "@/lib/stringArray";
import Modal from "@/components/Modal.vue";

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
  close: {
    type: Function as PropType<(e: Event) => void>,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  data: {
    type: WebGLVertexArrayObject as PropType<LogEntry | null>,
    required: true,
  }
});

const { t } = useTranslation();

const logMessage = computed(() => {
  if (!props.data) return;

  try {
    return JSON.parse(censorPublicIpAddresses(props.data.message));
  } catch (e) {
    return props.data.message;
  }
});

</script>
<template>
  <Modal :close="close" :open="open" maxWidth="max-w-7xl max-h-[80vh]" :hidden="true" title="">

    <div class="my-6 w-full text-sm text-auto-10" v-if="data">
      <div class="flex h-min w-full flex-1 flex-col justify-center overflow-auto">
        <div
          class="relative flex flex-grow items-center justify-start gap-2 whitespace-nowrap px-3 text-xs line-clamp-1 w-available">
          <span>{{ $t('Time') }}:</span>
          <span>{{ userTime(data.time) }}</span>
        </div>
        <div
          class="relative flex flex-grow items-center justify-start gap-2 whitespace-nowrap px-3 text-xs line-clamp-1 w-available">
          <span>{{ $t('Type') }}:</span>
          <span class="h-5 w-20 rounded-full px-2 text-center leading-5" :style="`background: ${data.color}`">
            {{ data.type }}
          </span>
        </div>
        <div
          class="relative flex flex-grow items-center justify-start gap-2 whitespace-nowrap px-3 text-xs line-clamp-1 w-available">
          <span>{{ $t('Level') }}:</span>
          <span>{{ data.level }}</span>
        </div>
        <div
          class="relative flex flex-grow flex-col items-start justify-start gap-4 overflow-auto px-3 text-xs line-clamp-1 w-available max-h-[60vh] whitespace-break-spaces">
          <span>{{ $t('Message') }}:</span>
          <!--				<ScrollContainer>-->

          <VueJsonPretty class="h-fit" :data="logMessage" />
          <!--					<span class="overflow-auto whitespace-pre text-left w-available">{{ censorPublicIpAddresses(data.message) }}</span>-->
          <!--				</ScrollContainer>-->
        </div>
      </div>
    </div>

    <template v-slot:actions>
      <Button id="no" :onClick="close" type="button" color="text-auto-alpha-11" variant="text">
        {{ t('Close') }}
      </button>
    </template>
  </Modal>
</template>
