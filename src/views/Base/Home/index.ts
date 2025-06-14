import { defineAsyncComponent } from 'vue';
import { isMobile, isTv, tvModeOverride } from '@/config/global';

export default defineAsyncComponent(() => {
	if (isTv.value || tvModeOverride.value) {
		return import('./Tv.vue');
	} else if (isMobile.value) {
		return import('./Mobile.vue');
	} else {
		return import('./Desktop.vue');
	}
});
