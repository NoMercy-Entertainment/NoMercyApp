<script lang="ts" setup>

import user from '@/store/user';
import currentServer from '@/store/currentServer';

import NoMercyAvatar from '@/components/Images/NoMercyAvatar.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
</script>

<template>
    <div
        class="flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start self-stretch border-0 py-2 px-2.5">
        <div
            class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start self-stretch gap-2.5">
            <div class="relative mx-auto rounded-full size-12 bg-auto-alpha-5">
                <NoMercyAvatar :user="user" :size="40" class="h-12"/>
            </div>
            <div
                class="relative flex flex-grow flex-col items-start justify-start gap-0.5">
                <p class="w-48 flex-shrink-0 flex-grow-0 font-semibold">
                    {{ user.name }}
                </p>
                <div
                    class="relative flex flex-shrink-0 flex-grow-0 items-center justify-start self-stretch gap-0.5">
                    <MoooomIcon v-if="currentServer" class="w-5" icon="server"/>
                    <MoooomIcon v-else class="w-5" icon="linkBroken"/>
                    <p class="flex-grow text-sm w-[174px]">
                        {{ currentServer?.server_name ?? $t('Not connected') }}
                    </p>
                </div>
            </div>
        </div>

    </div>
</template>
