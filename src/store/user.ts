import { computed, ref } from 'vue';

import type { User } from '@/types/auth';
import type Keycloak from '@/types/keycloak';
import { isPlatform } from '@ionic/vue';
import type { KeycloakComposable } from '@josempgon/vue-keycloak';
import type { KeycloakInstance } from '@josempgon/vue-keycloak/dist/types/keycloak';

export const u = ref<User>(<User>{
	accessToken: localStorage.getItem('access_token') || '',
	refreshToken: localStorage.getItem('refresh_token') || '',
	idToken: localStorage.getItem('id_token') || '',
});

export const user = computed(() => u.value);

export const testUserToken = ref('test');

export const keycloak = ref<Keycloak | KeycloakInstance>(<Keycloak | KeycloakInstance>{});

export function setUser(newUser: User): void {
	u.value = newUser;
}

export function setUserFromKeycloak(keycloakUser: Keycloak): void {
	if (!keycloakUser) {
		return;
	}
	if (!keycloakUser.tokenParsed) {
		return;
	}

	keycloak.value = keycloakUser;

	if (isPlatform('capacitor')) {
		localStorage.setItem('access_token', keycloakUser.token);
		localStorage.setItem('refresh_token', keycloakUser.refreshToken);
		localStorage.setItem('id_token', keycloakUser.idToken);
	}

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

export function setUserFromWebKeycloak(keycloakUser: KeycloakComposable): void {
	if (!keycloakUser) {
		return;
	}
	if (!keycloakUser.decodedToken) {
		return;
	}

	keycloak.value = keycloakUser.keycloak.value;

	u.value = {
		...u.value,
		name: keycloakUser.decodedToken.value.display_name,
		email: keycloakUser.decodedToken.value.email,
		id: keycloakUser.decodedToken.value.sub,
		accessToken: keycloakUser.token.value,
		locale: keycloakUser.decodedToken.value.locale,
		moderator: keycloakUser.decodedToken.value.realm_access?.roles.includes('nova') || false,
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
