<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { IonIcon, IonRippleEffect } from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';

import { dismissAppBanner, launchAndroidApp, showAppBanner } from '@/store/androidAppPrompt';
import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';
import Button from '@/components/Button.vue';

const route = useRoute();

function handleOpenApp() {
	launchAndroidApp(route.path);
}

function handleDismiss() {
	dismissAppBanner(false); // Session only
}

function handleDismissPermanently() {
	dismissAppBanner(true);
}
</script>

<template>
	<Transition name="slide-up">
		<div
			v-if="showAppBanner"
			class="fixed bottom-20 left-2 right-2 z-50 flex items-center gap-3 rounded-xl bg-surface-2 p-3 shadow-lg border border-white/10"
		>
			<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-[rgb(from_var(--color-theme-8)_r_g_b/20%)] p-1.5">
				<AppLogoSquare />
			</div>

			<div class="flex-1 min-w-0">
				<p class="text-sm font-medium text-text truncate">
					{{ $t('Open in NoMercy App') }}
				</p>
				<p class="text-xs text-text/60">
					{{ $t('Better experience in the app') }}
				</p>
			</div>

			<Button
				id="open-app-banner-btn"
				color="theme"
				variant="contained"
				:on-click="handleOpenApp"
			>
				{{ $t('Open') }}
			</Button>

			<button
				class="ion-activatable relative flex h-8 w-8 items-center justify-center rounded-full text-text/60 hover:text-text overflow-hidden"
				@click="handleDismiss"
				@long-press="handleDismissPermanently"
			>
				<IonRippleEffect />
				<IonIcon :icon="closeOutline" class="text-lg" />
			</button>
		</div>
	</Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
	transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
	transform: translateY(100%);
	opacity: 0;
}
</style>
