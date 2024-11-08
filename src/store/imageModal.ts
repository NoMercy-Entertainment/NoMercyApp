import {computed, ref} from 'vue';
import {LogoResponse} from '@/types/server';

const showImageModal = ref<boolean>();
export const showImageModalState = computed(() => showImageModal.value);
export const toggleImageModal = () => {
	showImageModal.value = !showImageModal.value;
};
export const setImageModalOpen = (open: boolean) => {
	showImageModal.value = open;
}

const screensaverDelay = ref<number>(5);
export const screensaverDelayState = computed(() => screensaverDelay.value);
export const setScreensaverDelay = (delay: number) => {
	screensaverDelay.value = delay;
}

const showScreensaver = ref<boolean>();
export const showScreensaverState = computed(() => showScreensaver.value);
export const toggleScreensaver = () => {
	showScreensaver.value = !showScreensaver.value;
};
export const setShowScreensaver = (open: boolean) => {
	showScreensaver.value = open;
}

const disableScreensaver = ref<boolean>();
export const disableScreensaverState = computed(() => disableScreensaver.value);
export const setDisableScreensaver = (disable: boolean) => {
	disableScreensaver.value = disable;
}

const imageModalData = ref<LogoResponse>();
export const imageModalDataState = computed(() => imageModalData.value);
export const setImageModalData = (data: any) => {
	imageModalData.value = data;
}
