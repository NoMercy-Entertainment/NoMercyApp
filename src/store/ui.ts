import { computed, ref, watch } from 'vue';
import type { PaletteColors } from '@/lib/colorHelper';
import { pickPaletteColor, tooDark, tooLight } from '@/lib/colorHelper';
import { isPlatform, useKeyboard } from '@ionic/vue';
import { SortOrder, SortType } from '@/types/musicPlayer';
import { useAutoThemeColors } from '@/store/preferences';
import { isXmasTime } from '@/lib/dateTime';
import { Keyboard } from '@capacitor/keyboard';
import { rgbaToHex } from '@uiw/color-convert';
import { rgbToHex } from '@/types/config.ts';
import { disableImmersiveMode } from '@/lib/utils.ts';
import { EdgeToEdge } from '@capawesome/capacitor-android-edge-to-edge-support';
import { isTv } from '@/config/global.ts';

export const scrollContainerElement = ref<HTMLDivElement>();
export const setupComplete = ref(false);

const p = ref<string | null>();
export const poster = computed(() => p.value);

export function setPoster(value?: string | null) {
	p.value = value;
}

const t = ref<string | null>();
export const title = computed(() => t.value);

export function setTitle(value?: string | null) {
	p.value = value;
}

const b = ref<string | null>();
export const background = computed(() => b.value);

export function setBackground(value?: string | null) {
	b.value = value;
}

const fc = ref('var(--color-theme-7)');
export const focusColor = computed(() => fc.value);

const c = ref<PaletteColors | null>();
export const colorPalette = computed(() => c.value);

export function setColorPalette(value?: PaletteColors | null) {
	c.value = value;

	if (!useAutoThemeColors.value) {
		fc.value = '';
		document.documentElement.style.removeProperty('--color-theme-8');
	}
	else {
		fc.value = pickPaletteColor(value, 20, 160);

		document.documentElement.style.setProperty('--color-theme-8', fc.value);
	}

	if (isPlatform('capacitor')) {
		let color = rgbaToHex({
			r: Number.parseInt(fc.value.split(' ')[0], 10) * 0.35,
			g: Number.parseInt(fc.value.split(' ')[1], 10) * 0.35,
			b: Number.parseInt(fc.value.split(' ')[2], 10) * 0.35,
			a: 1,
		});

		const style = window.getComputedStyle(document.body);
		const defaultColor = style.getPropertyValue('--color-theme-7');

		if (tooDark(color, 10)) {
			color = rgbToHex(defaultColor, 1);
		}
		if (tooLight(color, 160)) {
			color = rgbToHex(defaultColor, 1);
		}

		disableImmersiveMode().then();
		EdgeToEdge.setBackgroundColor({ color }).then();
	}
}

const l = ref<string | null>();
export const logo = computed(() => l.value);

export function setLogo(value?: string | null) {
	l.value = value;
}

interface StatusBarPlugin {
	show: () => void;
	hide: () => void;
	setBackgroundColor: (options: { color: string }) => void;
}

export const statusbar = computed(() => {
	if (isPlatform('capacitor') && !isTv.value) {
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

const st = ref<SortType>(SortType.index);
export const sortType = computed(() => st.value);

export function setSortType(value: any) {
	st.value = value;
}

const so = ref<SortOrder>(SortOrder.asc);
export const sortOrder = computed(() => so.value);

export function setSortOrder(value: any) {
	so.value = value;
}

const nav = ref(true);
export const navBarVisible = computed(() => nav.value);

export function setNavBarVisible(value: boolean) {
	nav.value = value;
}

export function toggleNavBarVisible() {
	nav.value = !nav.value;
}

export function showNavBar() {
	nav.value = true;
}

export function hideNavBar() {
	nav.value = false;
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
