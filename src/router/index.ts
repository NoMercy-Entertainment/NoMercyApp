import {createRouter, createWebHashHistory, createWebHistory} from '@ionic/vue-router';
import {routes} from '@/router/routes';
import beforeEach from '@/router/middleware/beforeEach';
import afterEach from '@/router/middleware/afterEach';
import promises from '@/router/middleware/beforeResolve';
import {handlePromises} from '@/router/middleware/handlePromises';
import {isPlatform} from '@ionic/vue';

const router = createRouter({
	history: isPlatform('capacitor')
		? createWebHistory(import.meta.env.BASE_URL)
		: createWebHashHistory(import.meta.env.BASE_URL),
	routes: routes,
});

router.beforeResolve(async (to, from, next) => {
	await handlePromises(promises, next);
});

beforeEach(router);
afterEach(router);

export default router;
