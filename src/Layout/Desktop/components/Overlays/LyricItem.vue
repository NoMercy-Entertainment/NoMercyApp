<script setup lang="ts">
import { type PropType } from "vue";

import OptimizedIcon from '@/components/OptimizedIcon.vue';

import type {Lyric} from "@/types/musicPlayer";

defineProps({
    lyric: {
        type: Object as PropType<Lyric>,
        required: true,
    },
    index: {
        type: Number,
        required: true,
    }
});

</script>

<template>
    <span data-lyric :data-index="index ?? -1" :id="typeof lyric != 'undefined' ? lyric?.time?.total.toString() : '-1'"
        class="tv:min-h-24 flex flex-col justify-center items-center gap-2 h-auto w-available transition-all duration-200 ease-in-out"
          :class="{
            'text-black': lyric?.time?.total,
            '!text-white': !lyric?.time?.total,
          }"
    >
        <span
            class="whitespace-pre-line tv:text-4xl font-bold transition-all duration-200 ease-in-out text-md tv:leading-[48px] text-pretty text-inherit w-available"
            v-if="lyric?.text !== ''">
            {{ lyric?.text }}
        </span>
        <span class="transition-all duration-200 ease-in-out w-available" v-if="lyric?.text === ''">
            <OptimizedIcon icon="noteDouble" class="transition-all duration-200 ease-in-out w-[1.5rem] h-[1.5rem]" />
        </span>
    </span>
</template>
