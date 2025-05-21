import { isMobile, isTv, tvModeOverride } from '@/config/global';

let View: () => Promise<any>;

if (isTv.value || tvModeOverride.value) {
	View = () => import('./Tv.vue');
} else if (isMobile.value) {
	View = () => import('../List/Mobile.vue');
} else {
	View = () => import('./Desktop.vue');
}

export default View;
