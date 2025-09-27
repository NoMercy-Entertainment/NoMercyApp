<script lang="ts" setup>
import type { PropType } from 'vue';
import VueMarkdown from 'vue-markdown-render';

import type { Message, User } from '@/types/auth';
import NoMercyAvatar from '@/components/Images/NoMercyAvatar.vue';
import KeepCounting from '@/components/KeepCounting.vue';
import { removeNotification } from '@/store/notifications';
import { removeMessage } from '@/store/messages.ts';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

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
	type: {
		type: String as PropType<'message' | 'notification'>,
		required: true,
	},
});

function handleClick() {
	if (props.type === 'message') {
		removeMessage(props.data);
	}
	else {
		removeNotification(props.data);
	}
}

function handleUpdateAccept() {
	document.dispatchEvent(new CustomEvent('sw-update-accepted'));

	if (props.type === 'message') {
		removeMessage(props.data);
	}
	else {
		removeNotification(props.data);
	}
}
</script>

<template>
	<div
		:class="{
			'border-1 bg-surface-12/2 border-surface-12/5': !data.read,
		}"
		class="flex justify-start items-start relative gap-2 p-2 rounded-lg"
	>
		<NoMercyAvatar
			v-if="(data.from as User).email"
			:user="data.from as User"
			class="w-10 min-w-10"
		/>
		<MoooomIcon
			v-else-if="data.type === 'update'"
			class-name="w-10 p-2.5 text-focus"
			icon="download"
		/>
		<MoooomIcon
			v-else-if="data.type === 'notice' && data.from === 'System'"
			class-name="w-10 p-2.5"
			icon="wrench"
		/>
		<MoooomIcon
			v-else-if="data.type === 'notice'"
			class-name="w-10 p-2.5"
			icon="infoCircle"
		/>
		<MoooomIcon
			v-else-if="data.type === 'event'"
			class-name="w-10 p-2.5"
			icon="wrench"
		/>
		<MoooomIcon
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
						@click="handleClick"
					>
						Later
					</button>
				</div>
			</div>
		</div>

		<!-- Regular close button for non-update notifications -->
		<button v-if="data.type !== 'update'" @click="handleClick">
			<MoooomIcon class-name="w-5" icon="cross" />
		</button>
	</div>
</template>
