import { Router } from 'vue-router';

const beforeEach = (router: Router) => {
	return router.beforeEach((to, from, next) => {
		next();
	});
};

export default beforeEach;

