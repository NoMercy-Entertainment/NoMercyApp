<script setup lang="ts">
import { useIsFetching, useIsMutating } from '@tanstack/vue-query';

import { sidebar } from '@/store/sidebar';
import indexer from '@/store/indexer';
import {searchResultLoading} from "@/store/search";

const isFetching = useIsFetching();
const isMutating = useIsMutating();

</script>

<template>
    <div id="gradientBorder" tabindex="-1" no-ring
        class="relative flex flex-1 overflow-clip border-transparent text-start outline-none transition-all duration-300 h-available w-available scrollbar-none sm:rounded-3xl"
        :class="{
            'sm:ml-[1.35rem]': sidebar == 'hidden',
            'sm:mr-[1.35rem]': !indexer,
            'busy sm:border-4 gradient-border': isFetching > 0 || isMutating > 0 || searchResultLoading,
            'sm:border-4 border-slate-light-3 dark:border-slate-dark-2': isFetching == 0 && isMutating == 0 && !searchResultLoading,
        }">
        <slot />
    </div>
</template>
