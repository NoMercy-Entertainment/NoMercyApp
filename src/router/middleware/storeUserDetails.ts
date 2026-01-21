import { refreshToken } from '@/lib/auth/index';
import { setUser, user } from '@/store/user';
import { useKeycloak } from '@josempgon/vue-keycloak';

export function storeUserDetails(): Promise<void> {
	return new Promise((resolve, reject) => {
		if (user.value?.id) {
			resolve();
			return;
		}

		try {
			const { isAuthenticated } = useKeycloak();

			if (isAuthenticated.value) {
				const { keycloak, roles, token } = useKeycloak();

				setUser({
					...user.value,
					accessToken: token.value,
				});

				if (keycloak.value?.idTokenParsed) {
					setUser({
						...user.value,
						id: keycloak.value?.idTokenParsed.sub as string,
						name: keycloak.value?.idTokenParsed.display_name
							?? keycloak.value?.idTokenParsed?.name,
						email: keycloak.value?.idTokenParsed?.email,
						moderator: roles.value.includes('nova'),
					});
				}

				return resolve();
			}
			else {
				refreshToken().then(() => {
					isAuthenticated.value = true;

					resolve();
				});
			}
		}
		catch {
			// location.reload();
			reject(new Error('Not authenticated'));
		}
	});
}
