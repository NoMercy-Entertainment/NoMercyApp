import { computed, ref, watch } from 'vue';
import type { VNodeRef } from 'vue';
import type { LogoResponse } from '@/types/server';

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
export function setImageModalData(data: any) {
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

const tmp = ref();
export const temp = computed(() => tmp.value);
export function setTemp(temp: any) {
	tmp.value = temp;
}

export const imageModal = ref<VNodeRef>();

watch([sim, sss], ([sim, sss]) => {
	if ((sim || sss) && !dss.value) {
		// document.querySelector<HTMLDialogElement>('#imageModal')?.showModal();
	}
	else {
		// document.querySelector<HTMLDialogElement>('#imageModal')?.close();
	}
});
