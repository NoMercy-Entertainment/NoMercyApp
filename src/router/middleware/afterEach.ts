import { Router } from 'vue-router';
import { isPlatform } from '@ionic/vue';

const afterEach = (router: Router) => {

	return router.afterEach((to) => {
		if (to.name) {
			document.title = to.name as string;
		}

		if (!isPlatform('capacitor')) {
            setTimeout(() => {
                document.querySelector<HTMLDivElement>('.ion-page .ion-page-invisible')
                    ?.classList.remove('ion-page-invisible');
            }, 500);
		}
	});
};

export default afterEach;
