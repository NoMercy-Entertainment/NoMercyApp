import { createRouter, createWebHistory } from 'vue-router';
import { isPlatform } from '@ionic/vue';

import { user } from '@/store/user';
import { routes } from '@/router/routes';
import beforeEach from '@/router/beforeEach';
import afterEach from '@/router/afterEach';
import promises from '@/router/beforeResolve';
import { handlePromises } from '@/router/handlePromises';
import { useKeycloak } from '@josempgon/vue-keycloak';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
});

router.beforeResolve(async (to, from, next) => {
	if (
		isPlatform('capacitor')
		&& to.name !== 'Auth'
		&& !user.value.accessToken
	) {
		const { isAuthenticated } = useKeycloak();
		if (!isAuthenticated.value) {
			return next({ name: 'Auth' });
		}
	}

	if (to.name === 'Auth') {
		return next();
	}

	await handlePromises(promises, next)
		.catch(() => next({ name: 'Server offline' }));
});

beforeEach(router);
afterEach(router);

export default router;
