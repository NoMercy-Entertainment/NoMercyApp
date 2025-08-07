import {
	createRouter,
	createWebHistory,
} from '@ionic/vue-router';
import { isPlatform } from '@ionic/vue';

import { isTv } from '@/config/global';
import { useKeycloak } from '@/lib/auth/tv-keycloak';
import { user } from '@/store/user';
import { routes } from '@/router/routes';
import beforeEach from '@/router/middleware/beforeEach';
import afterEach from '@/router/middleware/afterEach';
import promises from '@/router/middleware/beforeResolve';
import { handlePromises } from '@/router/middleware/handlePromises';

const router = createRouter({
	history: isPlatform('capacitor')
		? createWebHistory(import.meta.env.BASE_URL)
		: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeResolve(async (to, from, next) => {
	if (
		isPlatform('capacitor')
		&& to.name !== 'Auth'
		&& !user.value.accessToken
	) {
		const { isAuthenticated } = useKeycloak();
		if (!isAuthenticated.value && isTv.value) {
			return next({ name: 'Auth' });
		}
	}

	if (to.name === 'Auth') {
		return next();
	}

	await handlePromises(promises, next);
});

beforeEach(router);
afterEach(router);

export default router;
