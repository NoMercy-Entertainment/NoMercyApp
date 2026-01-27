<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { IonIcon, IonRippleEffect } from '@ionic/vue';
import { closeOutline, sparkles } from 'ionicons/icons';

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
				<IonIcon :icon="sparkles" class="text-lg text-focus" />
			</div>

			<p class="flex-1 text-sm text-text/80">
				{{ $t(message || contextMessages[context || 'general']) }}
			</p>

			<button
				class="ion-activatable relative flex h-8 items-center justify-center rounded-lg bg-focus px-3 text-xs font-medium text-white overflow-hidden flex-shrink-0"
				@click="handleOpenApp"
			>
				<IonRippleEffect />
				{{ $t('Open App') }}
			</button>

			<button
				class="ion-activatable relative flex h-6 w-6 items-center justify-center rounded-full text-text/40 hover:text-text/60 overflow-hidden flex-shrink-0"
				@click="handleDismiss"
			>
				<IonRippleEffect />
				<IonIcon :icon="closeOutline" class="text-sm" />
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
