<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';

import {
	canShowContextualPrompt,
	dismissContextualPromptForSession,
	launchAndroidApp,
} from '@/store/androidAppPrompt';

defineProps<{
	message?: string;
	context?: 'video' | 'music' | 'download' | 'general';
}>();

const route = useRoute();
const visible = ref(true);

const contextMessages: Record<string, string> = {
	video: 'Watch with better quality in the app',
	music: 'Listen with background playback in the app',
	download: 'Download for offline viewing in the app',
	general: 'Get the best experience in the app',
};

function handleOpenApp() {
	launchAndroidApp(route.path);
	visible.value = false;
}

function handleDismiss() {
	visible.value = false;
	dismissContextualPromptForSession();
}
</script>

<template>
	<Transition name="slide-fade">
		<div
			v-if="canShowContextualPrompt && visible"
			class="flex items-center gap-3 rounded-xl bg-focus/10 border border-focus/20 p-3 my-3"
		>
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-focus/20 flex-shrink-0">
				<MoooomIcon class-name="text-lg text-focus" icon="sparkles" />
			</div>

			<p class="flex-1 text-sm text-text/80">
				{{ $t(message || contextMessages[context || 'general']) }}
			</p>

			<button
				class="relative flex h-8 items-center justify-center rounded-lg bg-focus px-3 text-xs font-medium text-white overflow-hidden flex-shrink-0 active:brightness-90 transition-all"
				@click="handleOpenApp"
			>
				{{ $t('Open App') }}
			</button>

			<button
				class="relative flex h-6 w-6 items-center justify-center rounded-full text-text/40 hover:text-text/60 overflow-hidden flex-shrink-0"
				@click="handleDismiss"
			>
				<MoooomIcon class-name="w-4 h-4" icon="cross" />
			</button>
		</div>
	</Transition>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
	transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}
</style>
