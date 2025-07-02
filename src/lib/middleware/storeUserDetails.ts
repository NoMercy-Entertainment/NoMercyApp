import { useKeycloak } from '@/lib/auth/tv-keycloak';
import { refreshToken } from '@/lib/auth/index';
import { setUser, user } from '@/store/user';

export function storeUserDetails(): Promise<void> {
	return new Promise((resolve, reject) => {
		if (user.value?.id) {
			resolve();
			return;
		}

		try {
			const { isAuthenticated } = useKeycloak();

			if (isAuthenticated.value) {
				const { keycloak, roles, token, refreshToken } = useKeycloak();

				setUser({
					...user.value,
					accessToken: token.value,
					refreshToken: refreshToken.value,
				});

				if (keycloak.idTokenParsed) {
					setUser({
						...user.value,
						id: keycloak.idTokenParsed.sub as string,
						name:
              keycloak.idTokenParsed.display_name
              ?? keycloak.idTokenParsed?.name,
						email: keycloak.idTokenParsed?.email,
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
