import { computed, ref } from 'vue';
import { Preferences } from '@capacitor/preferences';
import { useLocalStorage } from '@vueuse/core';
import { isPlatform } from '@ionic/vue';
import { Browser } from '@capacitor/browser';

// Check if we should show Android prompts (Android browser, not in native app)
export const shouldShowAndroidPrompts = computed(
	() => !isPlatform('capacitor') && isPlatform('android'),
);

// Banner visibility preference
const bannerDismissed = useLocalStorage<boolean>('androidAppBannerDismissed', false);
export const showAppBanner = computed(() => !bannerDismissed.value && shouldShowAndroidPrompts.value);
(async () => {
	const { value } = await Preferences.get({ key: 'androidAppBannerDismissed' });
	if (value !== null) {
		bannerDismissed.value = value === 'true';
	}
})();

export function dismissAppBanner(permanently = false) {
	bannerDismissed.value = true;
	if (permanently) {
		Preferences.set({
			key: 'androidAppBannerDismissed',
			value: 'true',
		});
	}
}

export function resetAppBanner() {
	bannerDismissed.value = false;
	Preferences.remove({ key: 'androidAppBannerDismissed' });
}

// Welcome modal - shows every session unless permanently disabled
const welcomeModalPermanentlyDisabled = ref(false);
export const showWelcomeModal = ref(false);
(async () => {
	const { value } = await Preferences.get({ key: 'androidWelcomeModalDisabled' });
	welcomeModalPermanentlyDisabled.value = value === 'true';

	// Show welcome modal on each session unless permanently disabled
	if (!welcomeModalPermanentlyDisabled.value && shouldShowAndroidPrompts.value) {
		// Delay to let the app load first
		setTimeout(() => {
			showWelcomeModal.value = true;
		}, 1500);
	}
})();

export function closeWelcomeModal() {
	showWelcomeModal.value = false;
}

export function disableWelcomeModalPermanently() {
	showWelcomeModal.value = false;
	welcomeModalPermanentlyDisabled.value = true;
	Preferences.set({
		key: 'androidWelcomeModalDisabled',
		value: 'true',
	});
}

export function resetWelcomeModal() {
	welcomeModalPermanentlyDisabled.value = false;
	Preferences.remove({ key: 'androidWelcomeModalDisabled' });
}

// Contextual prompts preference (can be disabled by user)
const contextualPromptsEnabled = useLocalStorage<boolean>('androidContextualPromptsEnabled', true);
export const showContextualPrompts = computed(
	() => contextualPromptsEnabled.value && shouldShowAndroidPrompts.value,
);
(async () => {
	const { value } = await Preferences.get({ key: 'androidContextualPromptsEnabled' });
	if (value !== null) {
		contextualPromptsEnabled.value = value === 'true';
	}
})();

export function setContextualPromptsEnabled(enabled: boolean) {
	contextualPromptsEnabled.value = enabled;
	Preferences.set({
		key: 'androidContextualPromptsEnabled',
		value: enabled.toString(),
	});
}

// Track contextual prompt dismissals per session
const contextualPromptDismissedThisSession = ref(false);
export const canShowContextualPrompt = computed(
	() => showContextualPrompts.value && !contextualPromptDismissedThisSession.value,
);

export function dismissContextualPromptForSession() {
	contextualPromptDismissedThisSession.value = true;
}

// App launch utility with deep linking
export async function launchAndroidApp(path: string = '/') {
	if (!isPlatform('android')) {
		return;
	}

	const deepLink = `tv.nomercy.app://${path}`;

	try {
		await Browser.open({ url: deepLink });
		// Retry after a short delay as a fallback
		setTimeout(async () => {
			await Browser.open({ url: deepLink });
		}, 1000);
	}
	catch (error) {
		console.error('Failed to launch Android app:', error);
	}
}

// Check if native app is installed (uses Web API, Chrome on Android only)
export async function checkAppInstalled(): Promise<boolean> {
	try {
		if ('getInstalledRelatedApps' in navigator) {
			const relatedApps = await (navigator as any).getInstalledRelatedApps();
			return relatedApps.some((app: any) => app.id === 'tv.nomercy.app');
		}
	}
	catch (error) {
		console.error('Failed to check installed apps:', error);
	}
	return false;
}
