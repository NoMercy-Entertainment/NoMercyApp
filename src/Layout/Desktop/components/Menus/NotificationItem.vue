<script setup lang="ts">
import {type PropType} from "vue";
import VueMarkdown from 'vue-markdown-render'

import type {Message, User} from "@/types/auth";
import NoMercyAvatar from '@/components/Images/NoMercyAvatar.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import KeepCounting from '@/components/KeepCounting.vue';
import {clearNotifications} from "@/store/notifications";

defineProps({
  data: {
    type: Object as PropType<Message>,
    required: true,
  },
  open: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const handleClick = () => {
  clearNotifications();
}

</script>

<template>
  <div class="flex justify-start items-start relative gap-2 p-2 rounded-lg "
       :class="{
        'border-1 bg-slate-lightA-4  border-slate-light-7 dark:bg-slate-darkA-2 dark:border-slate-dark-4': !data.read,
        }"
  >
    <NoMercyAvatar v-if="(data.from as User).email" :user="data.from as User" class="w-10 min-w-10"/>
    <MoooomIcon v-else-if="data.type == 'notice' && data.from == 'System'" icon="wrench" className="w-10 p-2.5"/>
    <MoooomIcon v-else-if="data.type == 'notice'" icon="infoCircle" className="w-10 p-2.5"/>
    <MoooomIcon v-else-if="data.type == 'event'" icon="wrench" className="w-10 p-2.5"/>
    <MoooomIcon v-else-if="data.type == 'message'" icon="emailReceived" className="w-10 p-2.5"/>

    <div class="flex flex-grow flex-col items-start justify-start gap-3">
      <div class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-1 self-stretch">
        <p class="flex-shrink-0 flex-grow-0 self-stretch w-available">
          {{ (data.from as User).name ?? data.from }}
        </p>
        <div class="flex-shrink-0 flex-grow-0 self-stretch text-sm w-available text-auto-12">
          <VueMarkdown class="markdown" :source="data.body"/>
        </div>
        <p class="flex-shrink-0 flex-grow-0 self-stretch text-xs w-available">
          <KeepCounting :startTime="data.created_at" :relative="true"/>
        </p>
      </div>
    </div>

    <button @click="handleClick">
      <MoooomIcon icon="cross" className="w-5"/>
    </button>
  </div>
</template>
