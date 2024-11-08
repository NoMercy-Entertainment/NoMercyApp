import {computed, ref} from 'vue';
import {PaletteColors} from '@/lib/colorHelper';


const p = ref<string>();
export const poster = computed(() => p.value);
export function setPoster(value: string) {
  p.value = value;
}

const b = ref<string>();
const background = computed(() => b.value);
export function setBackground(value: string) {
  b.value = value;
}

const c = ref<PaletteColors|null>(null);
export const colorPalette = computed(() => c.value);
export function setColorPalette(value: PaletteColors|null) {
  c.value = value;
}
