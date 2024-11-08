<script setup lang="ts">
import {sidebarState} from '@/store/sidebar';

import indexer from '@/store/indexer';
import {useIsFetching} from '@tanstack/vue-query';

const isFetching = useIsFetching();

</script>

<template>
    <div id="gradientBorder" tabindex="-1"
         class="relative flex flex-1 overflow-clip border-transparent text-start outline-none transition-all duration-300 h-available w-available scrollbar-none gradient-border sm:rounded-3xl"
        :class="{
            'sm:ml-4': sidebarState == 'hidden',
            'sm:mr-4': !indexer,
            'busy sm:border-4': isFetching > 0,
        }">
        <slot />
    </div>
</template>
