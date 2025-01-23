<script setup lang="ts">
import { type PropType } from "vue";

import type { LibrariesResponse } from "@/types/api/base/library";
import DashboardCard from "@/components/Cards/DashboardCard.vue";
import TMDBImage from "@/components/Images/TMDBImage.vue";

defineProps({
    data: {
        type: Object as PropType<LibrariesResponse>,
        required: true,
    }
});

</script>

<template>
    <DashboardCard :route="`/dashboard/specials/${data.id}`" :line1="data.title">
        <template v-slot:image>
            <div
                class="relative flex flex-shrink-0 flex-grow-0 flex-col items-center justify-center self-stretch overflow-clip rounded-lg bg-theme-8 aspect-poster">
                <div class="backdropCard-overlay"></div>
                <TMDBImage v-if="data.poster" :path="data.poster" class="z-0 h-full" class-name="h-full object-cover" />
                <span v-else class="text-xl font-bold">{{ data.title }}</span>
            </div>
        </template>
    </DashboardCard>
</template>
