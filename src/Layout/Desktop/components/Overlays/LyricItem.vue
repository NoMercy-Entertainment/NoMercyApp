<script setup lang="ts">
import { type PropType } from "vue";

import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

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
        class="tv:min-h-28 flex flex-col justify-center items-center gap-2 h-auto w-available transition-all duration-300 ease-in-out"
          :class="{
            'text-black': lyric?.time?.total,
            '!text-white': !lyric?.time?.total,
          }"
    >
        <span
            class="whitespace-pre-line tv:text-4xl font-bold transition-all duration-300 ease-in-out text-md tv:leading-[48px] text-pretty w-available"
            v-if="lyric?.text !== ''">
            {{ lyric?.text }}
        </span>
        <span class="transition-all duration-300 ease-in-out w-available" v-if="lyric?.text === ''">
            <MoooomIcon icon="noteDouble" class="transition-all duration-300 ease-in-out w-[1.5rem] h-[1.5rem]" />
        </span>
    </span>
</template>
