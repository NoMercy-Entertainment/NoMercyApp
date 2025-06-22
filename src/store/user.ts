import { computed, ref } from 'vue';

import type { User } from '@/types/auth';
import type Keycloak from '@/types/keycloak';

export const u = ref<User>(<User>{
	accessToken: localStorage.getItem('access_token') || '',
	refreshToken: localStorage.getItem('refresh_token') || '',
	idToken: localStorage.getItem('id_token') || '',
});

export const user = computed(() => u.value);

export const testUserToken = ref('test');

export const keycloak = ref<Keycloak>(<Keycloak>{});

export function setUser(newUser: User): void {
	u.value = newUser;
}

export function setUserFromKeycloak(keycloakUser: Keycloak): void {
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

	u.value = {
		...u.value,
		name: keycloakUser.tokenParsed.display_name,
		email: keycloakUser.tokenParsed.email,
		id: keycloakUser.tokenParsed.sub,
		accessToken: keycloakUser.token,
		locale: keycloakUser.tokenParsed.locale,
		moderator: keycloakUser.hasRealmRole('nova'),
	};
}

export function updateUserFromApi(newUser: User): void {
	u.value = {
		...u.value,
		avatarUrl: newUser.avatarUrl,
		receivedMessages: newUser.receivedMessages,
		sendMessages: newUser.sendMessages,
		notifications: newUser.notifications,
	};
}
