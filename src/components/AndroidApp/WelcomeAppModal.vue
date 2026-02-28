<script lang="ts" setup>
import { useRoute } from 'vue-router';

import {
	closeWelcomeModal,
	disableWelcomeModalPermanently,
	launchAndroidApp,
	showWelcomeModal,
} from '@/store/androidAppPrompt';
import AppLogoSquare from '@/components/Images/icons/AppLogoSquare.vue';
import MoooomIcon from '@/components/Images/icons/MoooomIcon.vue';
import Button from '@/components/Button.vue';

const route = useRoute();

const benefits = [
	'Smoother video playback',
	'Offline downloads',
	'Background audio',
	'Push notifications',
];

function handleOpenApp() {
	launchAndroidApp(route.path);
	closeWelcomeModal();
}

function handleContinueInBrowser() {
	closeWelcomeModal();
}

function handleDontShowAgain() {
	disableWelcomeModalPermanently();
}
</script>

<template>
	<Teleport to="body">
		<Transition name="fade">
			<div
				v-if="showWelcomeModal"
				class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
				@click.self="handleContinueInBrowser"
			>
				<Transition name="scale">
					<div
						v-if="showWelcomeModal"
						class="relative w-full max-w-sm rounded-2xl bg-surface-1 p-6 shadow-2xl"
					>
						<button
							class="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-text/60 hover:text-text overflow-hidden active:bg-surface-3 transition-colors"
							@click="handleContinueInBrowser"
						>
							<MoooomIcon class-name="w-5 h-5" icon="cross" />
						</button>

						<div class="mb-4 flex justify-center">
							<div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgb(from_var(--color-theme-8)_r_g_b/20%)] p-2">
								<AppLogoSquare />
							</div>
						</div>

						<h2 class="mb-2 text-center text-xl font-bold text-text">
							{{ $t('Get the NoMercy App') }}
						</h2>

						<p class="mb-4 text-center text-sm text-text/70">
							{{ $t('Enjoy a better experience with our native app') }}
						</p>

						<ul class="mb-6 space-y-2">
							<li
								v-for="benefit in benefits"
								:key="benefit"
								class="flex items-center gap-2 text-sm text-text/80"
							>
								<MoooomIcon class-name="w-5 h-5 text-[var(--color-theme-8)]" icon="check" />
								{{ $t(benefit) }}
							</li>
						</ul>

						<div class="space-y-3">
							<Button
								id="open-in-app-btn"
								class="w-full h-12"
								color="theme"
								variant="contained"
								:on-click="handleOpenApp"
							>
								{{ $t('Open in App') }}
							</Button>

							<Button
								id="continue-in-browser-btn"
								class="w-full h-12"
								color="gray"
								variant="text"
								:on-click="handleContinueInBrowser"
							>
								{{ $t('Continue in Browser') }}
							</Button>

							<button
								class="w-full text-center text-xs text-text/50 hover:text-text/70 py-1"
								@click="handleDontShowAgain"
							>
								{{ $t("Don't show app suggestions") }}
							</button>
						</div>
					</div>
				</Transition>
			</div>
		</Transition>
	</Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
	transition: all 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
	opacity: 0;
	transform: scale(0.95);
}
</style>
