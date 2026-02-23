import type { Router } from 'vue-router';
import { prefetchForRoute } from '@/services/PrefetchService';

function afterEach(router: Router) {
	return router.afterEach((to) => {
		if (to.name) {
			document.title = to.name as string;
		}

		// Prefetch data for likely next routes
		prefetchForRoute(to);
	});
}

export default afterEach;
