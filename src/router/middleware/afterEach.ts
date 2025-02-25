import { Router } from 'vue-router';
import { isPlatform } from '@ionic/vue';
// import { ignoredRedirectQueries } from '@/config/config';

const afterEach = (router: Router) => {

	return router.afterEach((to) => {
		if (to.name) {
			document.title = to.name as string;
		}

		if (!isPlatform('capacitor')) {
			// const [hash, query] = location.hash.split('?');
			// if (new URLSearchParams(hash.at(-1)).size > 0) {
			// 	if (hash && hash != location.hash && !ignoredRedirectQueries.some(iq => query?.includes(iq))) {
			// 		localStorage.setItem('hash', hash);
			// 		router.replace({ query: {} }).then();
			// 	} else {
			// 		if (new URLSearchParams(location.hash.split('&').at(-1)).size > 0) {
			// 			const hash = location.hash.split('&').at(0);
			// 			if (hash && !ignoredRedirectQueries.some(iq => query?.includes(iq))) {
			// 				localStorage.setItem('hash', hash);
			// 				location.hash = hash;
			// 			}
			// 		}
			// 	}
			//
			// 	setTimeout(() => {
			// 		document.querySelector<HTMLDivElement>('.ion-page .ion-page-invisible')
			// 			?.classList.remove('ion-page-invisible');
			// 	}, 500);
			// }

			if (location.search) {
				history.replaceState(null, '', location.pathname);
			}
			
			setTimeout(() => {
				document.querySelector<HTMLDivElement>('.ion-page .ion-page-invisible')
					?.classList.remove('ion-page-invisible');
			}, 500);

		}
	});
};

export default afterEach;
