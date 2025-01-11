<script setup lang="ts">
import {type PropType} from "vue";

import type {ServerUser} from '@/types/auth';

import DashboardCard from '@/components/Cards/DashboardCard.vue';

defineProps({
    data: {
        type: Object as PropType<ServerUser>,
        required: true,
    }
});

</script>

<template>
    <DashboardCard
        :route="`/dashboard/users/${data.id}`"
        :line1="data.name"
        line2=""
    >
        <template v-slot:image >
            <div
                class="relative flex aspect-square h-auto w-full flex-col items-center justify-center overflow-clip rounded-lg bg-black"
            >
                <div class="backdropCard-overlay"></div>
                <img :src="data.avatar" class="w-full h-full object-cover rounded-lg"  alt=""/>
            </div>
        </template>
    </DashboardCard>
</template>
