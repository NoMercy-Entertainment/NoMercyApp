<script setup lang="ts">

import {type PropType} from "vue";
import type {EncoderProfile} from '@/types/api/base/library';
import DashboardCard from '@/components/Cards/DashboardCard.vue';

defineProps({
    data: {
        type: Object as PropType<EncoderProfile>,
        required: true,
    }
})

</script>

<template>
    <DashboardCard
        :route="`/dashboard/encoderprofiles/${data.id}`"
        :line1="data.name"
        line2=""
    >
        <template v-slot:image >
            <div
                class="relative flex aspect-video flex-shrink-0 flex-grow-0 flex-col items-center justify-center self-stretch overflow-clip rounded-lg bg-theme-11 dark:bg-theme-8  text-slate-light-12/80 dark:text-slate-dark-12/80"
            >
                <div class="backdropCard-overlay"></div>
                <span class="text-xl font-bold">{{ data.name }}</span>
            </div>
        </template>
    </DashboardCard>
</template>
