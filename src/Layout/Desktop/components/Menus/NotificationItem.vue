<script lang="ts" setup>
import type { PropType } from 'vue';
import VueMarkdown from 'vue-markdown-render';

import type { Message, User } from '@/types/auth';
import NoMercyAvatar from '@/components/Images/NoMercyAvatar.vue';
import OptimizedIcon from '@/components/OptimizedIcon.vue';
import KeepCounting from '@/components/KeepCounting.vue';
import { clearNotifications, removeNotification } from '@/store/notifications';

const props = defineProps({
	data: {
		type: Object as PropType<Message>,
		required: true,
	},
	open: {
		type: Boolean,
		required: false,
		default: false,
	},
});

function handleClick() {
	clearNotifications();
}

function handleUpdateAccept() {
	// Trigger the service worker update
	document.dispatchEvent(new CustomEvent('sw-update-accepted'));
	// Remove the notification
	removeNotification(props.data);
}

function handleUpdateDismiss() {
	// Just remove the notification without updating
	removeNotification(props.data);
}
</script>

<template>
	<div
		:class="{
			'border-1 bg-surface-4/11  border-slate-7 dark:bg-surface-2/11 dark:border-slate-4':
				!data.read,
		}"
		class="flex justify-start items-start relative gap-2 p-2 rounded-lg"
	>
		<NoMercyAvatar
			v-if="(data.from as User).email"
			:user="data.from as User"
			class="w-10 min-w-10"
		/>
		<OptimizedIcon
			v-else-if="data.type === 'update'"
			class-name="w-10 p-2.5 text-focus"
			icon="download"
		/>
		<OptimizedIcon
			v-else-if="data.type === 'notice' && data.from === 'System'"
			class-name="w-10 p-2.5"
			icon="wrench"
		/>
		<OptimizedIcon
			v-else-if="data.type === 'notice'"
			class-name="w-10 p-2.5"
			icon="infoCircle"
		/>
		<OptimizedIcon
			v-else-if="data.type === 'event'"
			class-name="w-10 p-2.5"
			icon="wrench"
		/>
		<OptimizedIcon
			v-else-if="data.type === 'message'"
			class-name="w-10 p-2.5"
			icon="emailReceived"
		/>

		<div class="flex flex-grow flex-col items-start justify-start gap-3">
			<div
				class="relative flex flex-shrink-0 flex-grow-0 flex-col items-start justify-start gap-1 self-stretch"
			>
				<p class="flex-shrink-0 flex-grow-0 self-stretch w-available">
					{{ data.title || ((data.from as User).name ?? data.from) }}
				</p>
				<div
					class="flex-shrink-0 flex-grow-0 self-stretch text-sm w-available"
				>
					<VueMarkdown :source="data.body" class="markdown" />
				</div>
				<p class="flex-shrink-0 flex-grow-0 self-stretch text-xs w-available">
					<KeepCounting :relative="true" :start-time="data.created_at" />
				</p>

				<!-- Special update notification actions -->
				<div
					v-if="data.type === 'update' && data.link === 'reload'"
					class="flex gap-2 mt-2"
				>
					<button
						class="px-3 py-1 text-xs bg-theme-5 hover:bg-theme-6 rounded-md transition-colors"
						@click="handleUpdateAccept"
					>
						{{ data.body }}
					</button>
					<button
						class="px-3 py-1 text-xs bg-gray-500 hover:bg-gray-600 rounded-md transition-colors"
						@click="handleUpdateDismiss"
					>
						Later
					</button>
				</div>
			</div>
		</div>

		<!-- Regular close button for non-update notifications -->
		<button v-if="data.type !== 'update'" @click="handleClick">
			<OptimizedIcon class-name="w-5" icon="cross" />
		</button>
	</div>
</template>
