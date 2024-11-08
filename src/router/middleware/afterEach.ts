import { Router } from 'vue-router';
import {isPlatform} from '@ionic/vue';

const afterEach = (router: Router) => {

	return router.afterEach((to, from) => {
		if (to.name) {
			document.title = to.name as string;
		}
		if (!isPlatform('capacitor')) {
			if (new URLSearchParams(location.hash.split('?').at(-1)).size > 0) {
				const hash = location.hash.split('?').at(0);
				if (hash) {
					localStorage.setItem('hash', hash);
					location.hash = hash;
				}
			}
			if (new URLSearchParams(location.hash.split('&').at(-1)).size > 0) {
				const hash = location.hash.split('&').at(0);
				if (hash) {
					localStorage.setItem('hash', hash);
					location.hash = hash;
				}
			}
		}
	});
};

export default afterEach;
