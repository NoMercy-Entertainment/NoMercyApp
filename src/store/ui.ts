import {computed, ref} from 'vue';
import {PaletteColors, pickPaletteColor} from '@/lib/colorHelper';
import {isPlatform} from '@ionic/vue';
import {SortOrder, SortType} from '@/types/musicPlayer';
import {useAutoThemeColors} from '@/store/preferences';

const p = ref<string|null>();
export const poster = computed(() => p.value);
export function setPoster(value?: string | null) {
  p.value = value;
}

const b = ref<string|null>();
export const background = computed(() => b.value);
export function setBackground(value?: string | null) {
  b.value = value;
}

const fc = ref('var(--color-theme-7)');
export const focusColor = computed(() => fc.value);

const c = ref<PaletteColors|null>();
export const colorPalette = computed(() => c.value);
export function setColorPalette(value?: PaletteColors|null) {
  c.value = value;

    if (!useAutoThemeColors.value) {
        fc.value = 'var(--color-theme-7)';
    }
    else {
        fc.value = pickPaletteColor(value, 1, 80)
            .replace(/,/gu, ' ')
            .replace('rgb(', '');

        document.documentElement.style.setProperty('--color-focus', fc.value);
    }
}

const l = ref<string|null>();
export const logo = computed(() => l.value);
export function setLogo(value?: string | null) {
  l.value = value;
}

interface StatusBarPlugin {
    show(): void;
    hide(): void;
    setBackgroundColor(options: {color: string}): void;
}

export const statusbar = computed(() => {
  if (isPlatform('capacitor')) {
    return import('@capacitor/status-bar')
        .then(({StatusBar}) => {
          return StatusBar
        });
  }
  return () => {};
});

export const showStatusbar = async () => {
   (await statusbar.value as StatusBarPlugin)?.show();
}

export const hideStatusbar = async () => {
  (await statusbar.value as StatusBarPlugin)?.hide();
}

export const setStatusBarColor = async (color: string) => {
  (await statusbar.value as StatusBarPlugin)?.setBackgroundColor({color});
}

const st = ref<SortType>(SortType.index);
export const sortType = computed(() => st.value);
export const setSortType = (value: any) => {
    st.value = value;
}

const so = ref<SortOrder>(SortOrder.asc);
export const sortOrder = computed(() => so.value);
export const setSortOrder = (value: any) => {
    so.value = value;
}
