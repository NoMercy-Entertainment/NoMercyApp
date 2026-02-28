import { computed, ref } from 'vue';
import { Preferences } from '@capacitor/preferences';
import { isPlatform } from '@ionic/vue';
import { Browser } from '@capacitor/browser';

// Check if we should show Android prompts (Android browser, not in native app)
export const shouldShowAndroidPrompts = computed(
	() => !isPlatform('capacitor') && isPlatform('android'),
);

// --- Welcome modal ---
// Shows ONCE EVER on first visit. After that, replaced by the small banner.
const welcomeModalShownBefore = ref(false);
const allPromptsPermanentlyDisabled = ref(false);
export const showWelcomeModal = ref(false);

(async () => {
	const [shown, disabled, legacy] = await Promise.all([
		Preferences.get({ key: 'androidWelcomeModalShown' }),
		Preferences.get({ key: 'androidAppPromptsDisabled' }),
		Preferences.get({ key: 'androidWelcomeModalDisabled' }), // legacy key
	]);

	welcomeModalShownBefore.value = shown.value === 'true';
	allPromptsPermanentlyDisabled.value = disabled.value === 'true' || legacy.value === 'true';

	if (!welcomeModalShownBefore.value && !allPromptsPermanentlyDisabled.value && shouldShowAndroidPrompts.value) {
		setTimeout(() => {
			showWelcomeModal.value = true;
		}, 1500);
	}
})();

export function closeWelcomeModal() {
	showWelcomeModal.value = false;
	if (!welcomeModalShownBefore.value) {
		welcomeModalShownBefore.value = true;
		Preferences.set({ key: 'androidWelcomeModalShown', value: 'true' });
	}
}

export function disableWelcomeModalPermanently() {
	showWelcomeModal.value = false;
	welcomeModalShownBefore.value = true;
	allPromptsPermanentlyDisabled.value = true;
	Preferences.set({ key: 'androidWelcomeModalShown', value: 'true' });
	Preferences.set({ key: 'androidAppPromptsDisabled', value: 'true' });
}

export function resetWelcomeModal() {
	welcomeModalShownBefore.value = false;
	allPromptsPermanentlyDisabled.value = false;
	Preferences.remove({ key: 'androidWelcomeModalShown' });
	Preferences.remove({ key: 'androidAppPromptsDisabled' });
	Preferences.remove({ key: 'androidWelcomeModalDisabled' });
}

// --- App banner ---
// Shows ONCE PER APP LOAD after the welcome modal has been seen.
// Permanent dismiss suppresses it forever.
const bannerPermanentlyDismissed = ref(false);
const bannerDismissedThisSession = ref(false);

export const showAppBanner = computed(
	() =>
		welcomeModalShownBefore.value
		&& !bannerPermanentlyDismissed.value
		&& !bannerDismissedThisSession.value
		&& !allPromptsPermanentlyDisabled.value
		&& shouldShowAndroidPrompts.value,
);

(async () => {
	const { value } = await Preferences.get({ key: 'androidAppBannerDismissed' });
	bannerPermanentlyDismissed.value = value === 'true';
})();

export function dismissAppBanner(permanently = false) {
	bannerDismissedThisSession.value = true;
	if (permanently) {
		bannerPermanentlyDismissed.value = true;
		Preferences.set({ key: 'androidAppBannerDismissed', value: 'true' });
	}
}

export function resetAppBanner() {
	bannerPermanentlyDismissed.value = false;
	bannerDismissedThisSession.value = false;
	Preferences.remove({ key: 'androidAppBannerDismissed' });
}

// --- Contextual prompts ---
// Inline prompts shown in content areas, dismissible per session.
const contextualPromptsEnabled = ref(true);
export const showContextualPrompts = computed(
	() => contextualPromptsEnabled.value && !allPromptsPermanentlyDisabled.value && shouldShowAndroidPrompts.value,
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

const contextualPromptDismissedThisSession = ref(false);
export const canShowContextualPrompt = computed(
	() => showContextualPrompts.value && !contextualPromptDismissedThisSession.value,
);

export function dismissContextualPromptForSession() {
	contextualPromptDismissedThisSession.value = true;
}

// --- App launch utility ---
export async function launchAndroidApp(path: string = '/') {
	if (!isPlatform('android')) {
		return;
	}

	const deepLink = `tv.nomercy.app://${path}`;

	try {
		await Browser.open({ url: deepLink });
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
			const relatedApps = await (navigator as unknown as { getInstalledRelatedApps: () => Promise<{ id: string }[]> }).getInstalledRelatedApps();
			return relatedApps.some((app) => app.id === 'tv.nomercy.app');
		}
	}
	catch (error) {
		console.error('Failed to check installed apps:', error);
	}
	return false;
}
