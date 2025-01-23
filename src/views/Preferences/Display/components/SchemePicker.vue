<script setup lang='ts'>
import { onMounted, watch } from 'vue';

import { useColorMode } from '@vueuse/core';
// import {setColorScheme} from "@/store/colorScheme";

const scheme = useColorMode({
    attribute: 'class',
    modes: {
        light: 'light',
        system: 'system',
        dark: 'dark',
    }
});

onMounted(() => {
});

watch(scheme, (value) => {
    //setColorScheme(value ? 'dark' : 'light');
});

</script>

<template>
    <div class="flex select-none flex-col gap-3">
        <p class="font-bold text-contrast">
            {{ $t('Theme') }}
        </p>
        <div class="flex flex-row gap-2">
            <div class="flex flex-shrink-0 flex-grow-0 items-center justify-center">
                <button id="light" title="Light" @click="scheme = 'light'"
                    class="relative flex h-10 w-10 flex-shrink-0 flex-grow-0 items-center justify-center rounded-3xl border-2"
                    :class="scheme == 'light'
                        ? 'border-[#6e56cf]'
                        : 'border-transparent'">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"
                        class="flex-shrink-0 flex-grow-0" preserveAspectRatio="xMidYMid meet">
                        <circle cx="15.0002" cy="15" r="15" fill="#EEECEC"></circle>
                    </svg>
                </button>
                <button id="auto" title="System default" @click="scheme = 'system'"
                    class="relative flex h-10 w-10 flex-shrink-0 flex-grow-0 items-center justify-center rounded-3xl border-2"
                    :class="scheme == 'system'
                        ? 'border-[#6e56cf]'
                        : 'border-transparent'">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"
                        class="flex-shrink-0 flex-grow-0 opacity-80" preserveAspectRatio="xMidYMid meet">
                        <circle opacity="0.8" cx="15.0005" cy="15" r="15" fill="url(#paint0_linear_4609_14480)">
                        </circle>
                        <defs>
                            <linearGradient id="paint0_linear_4609_14480" x1="0.333822" y1="0.333333" x2="30.3338"
                                y2="30.3333" gradientUnits="userSpaceOnUse">
                                <stop offset="0.479993" stop-color="white"></stop>
                                <stop offset="0.480523" stop-color="#1B1B1E"></stop>
                            </linearGradient>
                        </defs>
                    </svg>
                </button>
                <button id="dark" title="Dark" @click="scheme = 'dark'"
                    class="relative flex h-10 w-10 flex-shrink-0 flex-grow-0 items-center justify-center rounded-3xl border-2"
                    :class="scheme == 'dark'
                        ? 'border-[#6e56cf]'
                        : 'border-transparent'">
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"
                        class="flex-shrink-0 flex-grow-0 opacity-80" preserveAspectRatio="xMidYMid meet">
                        <circle opacity="0.8" cx="15.0005" cy="15" r="15" fill=""></circle>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</template>
