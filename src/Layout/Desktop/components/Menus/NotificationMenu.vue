<script setup lang="ts">
import {computed, onMounted, ref} from 'vue';

import notificationsState, {clearNotifications} from '@/store/notifications';

import DropdownMenu from '@/Layout/Desktop/components/Menus/DropdownMenu.vue';
import NotificationItem from '@/Layout/Desktop/components/Menus/NotificationItem.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const hasRang = ref(false);
const ringing = ref(false);

const hasUnreadNotifications = computed(() => {
  return notificationsState.value?.some(notification => !notification.read);
});

const handleClick = () => {
  clearNotifications();
}

const translate = computed(() => {
	// if (isMobile) {
	// 	return '[translate:4rem_0rem] sm:[translate:0]';
	// }

	return ' -translate-x-full';
});

onMounted(() => {
  if(!hasRang.value && hasUnreadNotifications.value){
    hasRang.value = true;
    ringing.value = true;
    setTimeout(() => {
      ringing.value = false;
    }, 3000);
  }
});

</script>

<template>
    <DropdownMenu className="my-1 rounded-md" :translate="translate">
        <template v-slot:button>
            <div class="relative my-1 flex flex-shrink-0 flex-grow-0 items-start justify-start gap-2 overflow-hidden rounded-md transition-colors duration-300 text-auto-12 hover:bg-focus/10 focus:bg-auto-12/2">
                <template v-if="hasUnreadNotifications">
                    <div :class="`relative p-2.5 w-full h-full origin-top ${ringing ? 'animate-swing' : ''}`">
                        <div class="absolute top-3 right-3 h-2 w-2 rounded-full bg-red-dark-7"></div>
                        <MoooomIcon icon="bellNotification"/>
                    </div>
                </template>
                <template v-else>
                    <div class="relative h-full w-full p-2.5">
                        <MoooomIcon icon="bell"/>
                    </div>
                </template>
            </div>
        </template>

        <div class="flex w-screen flex-col items-start justify-start p-2 max-w-[89vw] sm:max-w-md"
             style="box-shadow: 0 4px 7px 0 rgba(0,0,0,0.08);">
            <div
                class="relative h-auto flex-shrink-0 flex-grow-0 flex-col items-center justify-start gap-2 self-stretch z-1099 group sm:flex">
                <div class="flex w-full flex-col gap-2">

                    <div
                        class="relative flex w-full items-center justify-between px-2 py-1"
                    >
                        <p class="flex-shrink-0 flex-grow-0 text-xl font-bold">
                            {{ $t('Notifications') }}
                        </p>

                        <button @click="handleClick" v-if="hasUnreadNotifications"
                            class="relative flex h-5 items-center gap-2 overflow-hidden underline-offset-4 hover:underline"
                        >
                            <p class="flex-shrink-0 flex-grow-0 text-sm font-medium text-auto-10">
                                {{ $t('Mark all as read') }}
                            </p>
                        </button>
                    </div>

                    <template v-if="notificationsState?.length > 0">
                      <template v-for="item in notificationsState?.latest()" :key="item.id">
                        <NotificationItem :data="item"/>
                      </template>
                    </template>
                    <template v-else>
                        <div class="relative flex items-start justify-start gap-2 rounded-lg p-2" >
                            <div class="flex-shrink-0 flex-grow-0 self-stretch text-sm font-semibold text-slate-dark-10 dark:text-slate-light-10">
                                {{ $t('No notifications')}}
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </DropdownMenu>
</template>
