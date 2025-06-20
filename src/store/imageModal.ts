import {computed, ref, type VNodeRef, watch} from 'vue';
import { LogoResponse } from '@/types/server';

const sim = ref<boolean>(false);
export const showImageModal = computed(() => sim.value);
export const toggleImageModal = () => {
	sim.value = !sim.value;
};
export const setImageModalOpen = (open: boolean) => {
	sim.value = open;
}

const sss = ref<boolean>(false);
export const showScreensaver = computed(() => sss.value);
export const toggleScreensaver = () => {
	sss.value = !sss.value;
};
export const setShowScreensaver = (open: boolean) => {
	sss.value = open;
}

const dss = ref<boolean>(false);
export const disableScreensaver = computed(() => dss.value);
export const setDisableScreensaver = (disable: boolean) => {
	dss.value = disable;
}

const imd = ref<LogoResponse>();
export const imageModalData = computed(() => imd.value);
export const setImageModalData = (data: any) => {
	imd.value = data;
}

const ct = ref<'poster' | 'backdrop'>();
export const currentType = computed(() => ct.value);
export const setCurrentType = (type: 'poster' | 'backdrop') => {
	ct.value = type;
}

const ni = ref<number>(0);
export const newIndex = computed(() => ni.value);
export const setNewIndex = (index: number) => {
	ni.value = index;
}

const tmp = ref();
export const temp = computed(() => tmp.value);
export const setTemp = (temp: any) => {
	tmp.value = temp;
}

export const imageModal = ref<VNodeRef>();

watch([sim, sss], ([sim, sss]) => {
	if((sim || sss) && !dss.value){
		document.querySelector<HTMLDialogElement>('#imageModal')?.showModal();
	} else  {
		document.querySelector<HTMLDialogElement>('#imageModal')?.close();
	}
});