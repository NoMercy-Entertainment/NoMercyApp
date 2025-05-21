import { Component } from 'vue';

import { isMobile, isTv, tvModeOverride } from '@/config/global';

import Tv from './Tv.vue';
import Mobile from './Mobile.vue';
import Desktop from './Desktop.vue';

let View: Component;

if (isTv.value || tvModeOverride.value) {
	View = Tv;
} else if (isMobile.value) {
	View = Mobile;
} else {
	View = Desktop;
}

export default View;
