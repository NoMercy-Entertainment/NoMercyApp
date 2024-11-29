import { Router } from 'vue-router';
// import {currentServer} from '@/store/currentServer';
// import {setupComplete} from '@/store/ui';

const beforeEach = (router: Router) => {
	return router.beforeEach((to, from, next) => {
		// if (!setupComplete.value && !currentServer.value && to.name != 'Select Server') {
		// 	router.push({name: 'Select Server'}).then(next);
		// 	return;
		// }
		next();
	});
};

export default beforeEach;

