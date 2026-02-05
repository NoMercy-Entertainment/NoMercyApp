import { computed, ref, shallowRef, watch } from 'vue';
import type { PaletteColors } from '@/lib/colorHelper';
import { pickPaletteColor } from '@/lib/colorHelper';
import { isPlatform, useKeyboard } from '@ionic/vue';
import { SortOrder, SortType } from '@/types/musicPlayer';
import { useAutoThemeColors } from '@/store/preferences';
import { isXmasTime } from '@/lib/dateTime';
import { Keyboard } from '@capacitor/keyboard';

import { applyNativeColor } from '@/store/colorTheme.ts';

export const scrollContainerElement = shallowRef<HTMLDivElement>();
export const sidebarContainerElement = shallowRef<HTMLElement>();
export const setupComplete = ref(false);

const posterData = ref<string | null>(null);
export const poster = computed(() => posterData.value);

export function setPoster(value?: string | null) {
	posterData.value = value ?? null;
}

const titleData = ref<string | null>(null);
export const title = computed(() => titleData.value);

export function setTitle(value?: string | null) {
	titleData.value = value ?? null;
}

const backgroundData = ref<string | null>(null);
export const background = computed(() => backgroundData.value);

export function setBackground(value?: string | null) {
	backgroundData.value = value ?? null;
}

const focusColorData = ref('var(--color-theme-8)');
export const focusColor = computed(() => focusColorData.value);

const colorPaletteData = shallowRef<PaletteColors | null>(null);
export const colorPalette = computed(() => colorPaletteData.value);

export async function setColorPalette(value?: PaletteColors | null) {
	colorPaletteData.value = value ?? null;

	if (!useAutoThemeColors.value) {
		focusColorData.value = '';
		document.documentElement.style.removeProperty('--color-theme-8');
	}
	else {
		focusColorData.value = pickPaletteColor(value, 20, 160);

		document.documentElement.style.setProperty('--color-theme-8', focusColorData.value);
	}

	await applyNativeColor();
}

const logoData = ref<string | null>(null);
export const logo = computed(() => logoData.value);

export function setLogo(value?: string | null) {
	logoData.value = value ?? null;
}

interface StatusBarPlugin {
	show: () => void;
	hide: () => void;
	setBackgroundColor: (options: { color: string }) => void;
}

export const statusbar = computed(() => {
	if (isPlatform('capacitor')) {
		return import('@capacitor/status-bar').then(({ StatusBar }) => {
			return StatusBar;
		});
	}
	return () => {
	};
});

export async function showStatusbar() {
	((await statusbar.value) as StatusBarPlugin)?.show();
}

export async function hideStatusbar() {
	((await statusbar.value) as StatusBarPlugin).hide();
}

export async function setStatusBarColor(color: string) {
	((await statusbar.value) as StatusBarPlugin)?.setBackgroundColor({ color });
}

const sortTypeData = ref<SortType>(SortType.index);
export const sortType = computed(() => sortTypeData.value);

export function setSortType(value: SortType) {
	sortTypeData.value = value;
}

const sortOrderData = ref<SortOrder>(SortOrder.asc);
export const sortOrder = computed(() => sortOrderData.value);

export function setSortOrder(value: SortOrder) {
	sortOrderData.value = value;
}

const navBarVisibleData = ref(true);
export const navBarVisible = computed(() => navBarVisibleData.value);

export function setNavBarVisible(value: boolean) {
	navBarVisibleData.value = value;
}

export function toggleNavBarVisible() {
	navBarVisibleData.value = !navBarVisibleData.value;
}

export function showNavBar() {
	navBarVisibleData.value = true;
}

export function hideNavBar() {
	navBarVisibleData.value = false;
}

(async () => {
	if (isXmasTime()) {
		document.documentElement.classList.add('xmas');
	}
})();

const { keyboardHeight } = useKeyboard();
watch(keyboardHeight, (value) => {
	if (value) {
		document.documentElement.classList.add('keyboard-open');
		document.documentElement.style.setProperty('--keyboard-height', `${value}px`);
	}
	else {
		document.documentElement.classList.remove('keyboard-open');
		document.documentElement.style.setProperty('--keyboard-height', '0px');
	}
});

if (isPlatform('capacitor')) {
	Keyboard.addListener('keyboardWillShow', (info) => {
		console.log('keyboard did show with height:', info.keyboardHeight);
		document.documentElement.classList.add('keyboard-open');
		if (info.keyboardHeight) {
			document.documentElement.style.setProperty('--keyboard-height', `${info.keyboardHeight}px`);
		}
		else {
			document.documentElement.style.setProperty('--keyboard-height', '0px');
		}
	}).then();
	Keyboard.addListener('keyboardWillHide', () => {
		document.documentElement.classList.remove('keyboard-open');
		document.documentElement.style.setProperty('--keyboard-height', '0px');
	}).then();
}
