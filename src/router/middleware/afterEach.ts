import { Router } from 'vue-router';
import { isPlatform } from '@ionic/vue';

const removableQueries = ['code', 'state', 'session_state'];

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

            const query = { ...to.query };
            let hasRemovableQuery = false;

            removableQueries.forEach(param => {
                if (query[param]) {
                    delete query[param];
                    hasRemovableQuery = true;
                }
            });

            // remove trailing ? from query
            for (const param in query) {
                if (query[param]?.includes('?')) {
                    query[param] = (query[param] as string)!.split('?').at(0)!;
                }
            }

            if (hasRemovableQuery) {
                router.replace({ query }).then();
            }

            setTimeout(() => {
                document.querySelector<HTMLDivElement>('.ion-page .ion-page-invisible')
                    ?.classList.remove('ion-page-invisible');
            }, 500);
		}
	});
};

export default afterEach;
