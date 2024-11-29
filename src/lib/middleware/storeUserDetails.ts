import {isPlatform} from '@ionic/vue';

import {useKeycloak} from '@/lib/auth/tv-keycloak';
import {refreshToken} from '@/lib/auth/index';
import {user} from '@/store/user'

export const storeUserDetails = (): Promise<void> => {
	return new Promise((resolve, reject) => {
		if (!isPlatform('capacitor') || user.value.accessToken) {
			resolve();
			return;
		}

		try {
			const {isAuthenticated} = useKeycloak();

			if (isAuthenticated.value) {

				const {
					keycloak,
					roles,
					token,
					refreshToken,
				} = useKeycloak();

				user.value = {
					...user.value,
					accessToken: token.value,
					refreshToken: refreshToken.value,
				};

				if (keycloak.idTokenParsed) {
					console.log(keycloak.idTokenParsed);
					user.value = {
						...user.value,
						id: keycloak.idTokenParsed.sub as string,
						name: keycloak.idTokenParsed.display_name ?? keycloak.idTokenParsed?.name,
						email: keycloak.idTokenParsed?.email,
						moderator: roles.value.includes('nova'),
					};
				}

				return resolve();
			}
			else {

				refreshToken().then(() => {

					isAuthenticated.value = true;

					resolve();
				});
			}

		} catch (error) {
			reject(new Error('Not authenticated'));
		}
	});
};
