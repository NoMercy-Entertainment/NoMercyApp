import {computed, ref} from 'vue';

import type {User} from '@/types/auth';
import Keycloak from '@/types/keycloak';

const u = ref<User>(<User>{});
export const user = computed(() => u.value);

export const testUserToken = ref('test');

export const keycloak = ref<Keycloak>(<Keycloak>{});

export const setUser = (newUser: User): void => {
	u.value = newUser;
}

export const getUser = (): User => {
	return u.value!;
}

export const setUserFromKeycloak = (keycloakUser: Keycloak): void => {
	keycloak.value = keycloakUser;

	localStorage.setItem('access_token', keycloakUser.token);
	localStorage.setItem('refresh_token', keycloakUser.refreshToken);
	localStorage.setItem('id_token', keycloakUser.idToken);

	u.value = {
		...u.value,
		name: keycloakUser.tokenParsed.display_name,
		email: keycloakUser.tokenParsed.email,
		id: keycloakUser.tokenParsed.sub,
		accessToken: keycloakUser.token,
		locale: keycloakUser.tokenParsed.locale,
		moderator: keycloakUser.hasRealmRole('nova'),
	}
}

export const updateUserFromApi = (newUser: User): void => {
	u.value = {
		...u.value,
		avatar: newUser.avatar,
		messages: newUser.messages,
	}
}
