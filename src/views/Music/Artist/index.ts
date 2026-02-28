import { defineAsyncComponent } from 'vue';
import { isMobile } from '@/config/global';

export default defineAsyncComponent(() => {
	if (isMobile.value) {
		return import('../List/Mobile.vue');
	}
	else {
		return import('./Desktop.vue');
	}
});
