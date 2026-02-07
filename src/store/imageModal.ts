import type { VNodeRef } from 'vue';
import { computed, ref, watch } from 'vue';
import type { LogoResponse } from '@/types/server';
import { isPlatform } from '@ionic/vue';


const sim = ref<boolean>(false);
export const showImageModal = computed(() => sim.value);

export function toggleImageModal() {
	sim.value = !sim.value;
}

export function setImageModalOpen(open: boolean) {
	sim.value = open;
}

const sss = ref<boolean>(false);
export const showScreensaver = computed(() => sss.value);

export function toggleScreensaver() {
	sss.value = !sss.value;
}

export function setShowScreensaver(open: boolean) {
	sss.value = open;
}

const dss = ref<boolean>(false);
export const disableScreensaver = computed(() => dss.value);

export function setDisableScreensaver(disable: boolean) {
	dss.value = disable;
}

const imd = ref<LogoResponse>();
export const imageModalData = computed(() => imd.value);

export function setImageModalData(data: LogoResponse | undefined): void {
	imd.value = data;
}

const ct = ref<'poster' | 'backdrop'>();
export const currentType = computed(() => ct.value);

export function setCurrentType(type: 'poster' | 'backdrop') {
	ct.value = type;
}

const ni = ref<number>(0);
export const newIndex = computed(() => ni.value);

export function setNewIndex(index: number) {
	ni.value = index;
}

interface TempData {
	type: string;
	index: number;
}

const tmp = ref<TempData | null>(null);
export const temp = computed(() => tmp.value);

export function setTemp(temp: TempData | null): void {
	tmp.value = temp;
}

export const imageModal = ref<VNodeRef>();
watch([sim, sss], async ([sim, sss]) => {
	if ((sim || sss) && !dss.value) {
		if (isPlatform('capacitor')) {
			const [{ NavigationBar }, { EdgeToEdge }, { StatusBar }] = await Promise.all([
				import('@hugotomazi/capacitor-navigation-bar'),
				import('@capawesome/capacitor-android-edge-to-edge-support'),
				import('@capacitor/status-bar'),
			]);
			await Promise.all([
				NavigationBar.hide(),
				EdgeToEdge.disable(),
				StatusBar.hide(),
			]);
		}
		document.querySelector<HTMLDialogElement>('#imageModal')?.showModal();
		(document.activeElement as HTMLElement).blur();
	}
	else {
		if (isPlatform('capacitor')) {
			const [{ StatusBar }, { NavigationBar }, { EdgeToEdge }] = await Promise.all([
				import('@capacitor/status-bar'),
				import('@hugotomazi/capacitor-navigation-bar'),
				import('@capawesome/capacitor-android-edge-to-edge-support'),
			]);
			await Promise.all([
				StatusBar.show(),
				NavigationBar.show(),
				EdgeToEdge.enable(),
			]);
		}
		document.querySelector<HTMLDialogElement>('#imageModal')?.close();
	}
});
