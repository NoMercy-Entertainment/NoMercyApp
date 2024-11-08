import {ref} from 'vue';

import type {User} from '@/types/auth';
import Keycloak from '@/types/keycloak';

const user = ref<User>(<User>{});
export const keycloak = ref<Keycloak>(<Keycloak>{});

export const setUser = (newUser: User): void => {
	user.value = newUser;
}

export const getUser = (): User => {
	return user.value!;
}

export const setUserFromKeycloak = (keycloakUser: Keycloak): void => {
	keycloak.value = keycloakUser;

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
	console.log('Updating user from api', newUser);
	user.value = {
		...user.value,
		avatar: newUser.avatar,
		messages: newUser.messages,
	}
}

export default user;
