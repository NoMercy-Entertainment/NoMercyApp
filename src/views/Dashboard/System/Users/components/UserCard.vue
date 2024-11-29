<script setup lang="ts">
import {type PropType} from "vue";

import type {ServerUser} from '@/types/auth';

import DashboardCard from '@/components/Cards/DashboardCard.vue';
import Avatar from '@/components/Images/Avatar.vue';

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
                class="relative flex aspect-square h-auto w-full flex-col items-center justify-center overflow-clip rounded-lg bg-theme-9"
            >
                <div class="backdropCard-overlay"></div>
                <Avatar :email="data.email" class="w-full" />
            </div>
        </template>
    </DashboardCard>
</template>
