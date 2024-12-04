import {ref} from 'vue';

import type {User} from '@/types/auth';
import Keycloak from '@/types/keycloak';

export const user = ref<User>(<User>{
	accessToken: localStorage.getItem('access_token') || '',
	refreshToken: localStorage.getItem('refresh_token') || '',
	idToken: localStorage.getItem('id_token') || '',
});
// export const user = computed(() => user.value);

export const testUserToken = ref('test');

export const keycloak = ref<Keycloak>(<Keycloak>{});

export const setUser = (newUser: User): void => {
	user.value = newUser;
}

export const getUser = (): User => {
	return user.value!;
}

export const setUserFromKeycloak = (keycloakUser: Keycloak): void => {
	if (!keycloakUser) {
		alert('No user found');
		return;
	}
	if (!keycloakUser.tokenParsed) {
		alert('No token parsed');
		return;
	}

	keycloak.value = keycloakUser;

	localStorage.setItem('access_token', keycloakUser.token);
	localStorage.setItem('refresh_token', keycloakUser.refreshToken);
	localStorage.setItem('id_token', keycloakUser.idToken);

	user.value = {
		...user.value,
		name: keycloakUser.tokenParsed.display_name,
		email: keycloakUser.tokenParsed.email,
		id: keycloakUser.tokenParsed.sub,
		accessToken: keycloakUser.token,
		locale: keycloakUser.tokenParsed.locale,
		moderator: keycloakUser.hasRealmRole('nova'),
	}
}

export const updateUserFromApi = (newUser: User): void => {
	user.value = {
		...user.value,
		avatar: newUser.avatar,
		messages: newUser.messages,
	}
}
