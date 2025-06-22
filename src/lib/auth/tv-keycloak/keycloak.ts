import Keycloak from 'keycloak-js';
import {
	hasFailed,
	isAuthenticated,
	isPending,
	setRefreshToken,
	setToken,
} from './state';
import { isNil } from './utils';
import { isPlatform } from '@ionic/vue';

type KeycloakInstance = Keycloak.KeycloakInstance | undefined;

let $keycloak: KeycloakInstance;

export function isTokenReady(): Promise<void> {
	return new Promise(resolve => checkToken(resolve));
}

function checkToken(resolve: () => void) {
	if (!isNil($keycloak) && !isNil($keycloak?.token)) {
		resolve();
	}
	else {
		setTimeout(() => checkToken(resolve), 500);
	}
}

export function getKeycloak(): Keycloak.KeycloakInstance {
	return $keycloak as Keycloak.KeycloakInstance;
}

export function getToken(): Promise<string | undefined> {
	return updateToken();
}

export async function isLoggedIn(): Promise<boolean> {
	try {
		if (!$keycloak?.authenticated) {
			return false;
		}
		await updateToken();
		return true;
	}
	catch (error) {
		return false;
	}
}

export async function updateToken(): Promise<string | undefined> {
	if (!$keycloak) {
		throw new Error('Keycloak is not initialized.');
	}

	try {
		await $keycloak.updateToken(10);
		setToken($keycloak.token as string);
		setRefreshToken($keycloak.refreshToken as string);
	}
	catch (error: any) {
		hasFailed(true);
		console.error('Failed to refresh token:', error.message);
		throw new Error(error.message);
	}
	return $keycloak.token;
}

export function createKeycloak(
	config: Keycloak.KeycloakConfig | string,
): Keycloak.KeycloakInstance {
	$keycloak = new Keycloak(config);
	return getKeycloak();
}

export async function initKeycloak(
	initConfig: Keycloak.KeycloakInitOptions,
): Promise<void> {
	try {
		if (!isPlatform('capacitor')) {
			isPending(true);
			const _isAuthenticated = await $keycloak!.init(initConfig);
			isAuthenticated(_isAuthenticated);
			if (!isNil($keycloak!.token)) {
				setToken($keycloak!.token as string);
			}

			$keycloak!.onAuthRefreshSuccess = () =>
				setToken($keycloak!.token as string);
			$keycloak!.onTokenExpired = () => updateToken();
		}
	}
	catch (error: any) {
		hasFailed(true);
		isAuthenticated(false);
		throw new Error(error);
	}
	finally {
		isPending(false);
	}
}
