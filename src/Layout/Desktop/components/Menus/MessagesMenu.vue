<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';

import messagesState, { markAllMessagesRead } from '@/store/messages';

import DropdownMenu from '@/Layout/Desktop/components/Menus/DropdownMenu.vue';
import NotificationItem from '@/Layout/Desktop/components/Menus/NotificationItem.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

const hasRang = ref(false);
const ringing = ref(false);

const hasUnreadMessages = computed(() => {
	return messagesState.value?.some(message => !message.read);
});

function handleClick() {
	markAllMessagesRead();
}

const translate = computed(() => {
	// if (isMobile) {
	// 	return '[translate:4rem_0rem] sm:[translate:0]';
	// }

	return ' -translate-x-0';
});

onMounted(() => {
	if (!hasRang.value && hasUnreadMessages.value) {
		hasRang.value = true;
		ringing.value = true;
		setTimeout(() => {
			ringing.value = false;
		}, 3000);
	}
});
</script>

<template>
	<DropdownMenu :translate="translate" class-name="my-1 rounded-md">
		<template #button="{ open }">
			<button
				:aria-label="$t('Messages menu')"
				class="relative my-1 flex flex-shrink-0 flex-grow-0 items-start justify-start gap-2 overflow-hidden rounded-md transition-colors duration-200 hover:bg-focus/10 focus:bg-surface-12/6"
			>
				<template v-if="hasUnreadMessages">
					<div
						:class="`relative p-2.5 w-full h-full origin-bottom ${
							ringing ? 'animate-swing' : ''
						}`"
					>
						<div
							class="absolute top-3 right-3 h-2 w-2 rounded-full bg-red-dark-7"
						/>
						<MoooomIcon icon="chatAlert" />
					</div>
				</template>
				<template v-else>
					<div class="relative h-full w-full p-2.5">
						<MoooomIcon icon="chatBubble" />
					</div>
				</template>
			</button>
		</template>

		<template #default="{ open }">
			<div
				:inert="!open"
				class="flex w-screen flex-col items-start justify-start p-2 max-w-[89vw] sm:max-w-md"
				style="box-shadow: 0 4px 7px 0 rgba(0, 0, 0, 0.08)"
			>
				<div
					class="relative h-auto flex-shrink-0 flex-grow-0 flex-col items-center justify-start gap-2 self-stretch z-1099 group sm:flex"
				>
					<div class="flex w-full flex-col gap-2">
						<div
							class="relative flex w-full items-center justify-between px-2 py-1"
						>
							<p class="flex-shrink-0 flex-grow-0 text-xl font-bold">
								{{ $t("Messages") }}
							</p>

							<button
								v-if="hasUnreadMessages"
								class="relative flex h-5 items-center gap-2 overflow-hidden underline-offset-4 hover:underline"
								@click="handleClick"
							>
								<p
									class="flex-shrink-0 flex-grow-0 text-sm font-medium text-surface-10"
								>
									{{ $t("Mark all as read") }}
								</p>
							</button>
						</div>

						<template v-if="messagesState?.length > 0">
							<template v-for="item in messagesState?.latest()" :key="item.id">
								<NotificationItem :data="item" :open="open" type="message" />
							</template>
						</template>
						<template v-else>
							<div
								class="relative flex items-start justify-start gap-2 rounded-lg p-2"
							>
								<div
									class="flex-shrink-0 flex-grow-0 self-stretch text-sm font-semibold text-slate-10 dark:text-slate-10"
								>
									{{ $t("No messages") }}
								</div>
							</div>
						</template>
					</div>
				</div>
			</div>
		</template>
	</DropdownMenu>
</template>
