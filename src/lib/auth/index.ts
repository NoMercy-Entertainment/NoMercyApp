import type { IDToken, RefreshTokenRequestData, TokenRequestData, TokenResponse } from './index.d';
import { generatePKCE, parseToken } from './helpers';
import apiClient from '@/lib/clients/apiClient';
import cdnClient from '../clients/cdnClient';

import { user } from '@/store/user';
import { isPlatform } from '@ionic/vue';
import { authBaseUrl } from '@/config/config';

const originalLocation = window.location.href.startsWith('file://')
	? 'http://localhost:5173'
	: window.location.origin;

localStorage.setItem('client_id', 'nomercy-ui');
localStorage.setItem('client_secret', 'BXZFX7FzoRplLuKjDrSHB04epMJbRv04');

const clientId = localStorage.getItem('client_id')!;
const clientSecret = localStorage.getItem('client_secret')!;

export default () => {
	// eslint-disable-next-line no-async-promise-executor
	return new Promise(async (resolve, reject) => {

		const params = getUrlParams();

		if (params?.error && params.error === 'access_denied') {
			await redirectToOAuth(true);
			return;
		}

		const authenticated = await checkAuth();
		if (!authenticated) {
			reject(new Error('Not authenticated'));
			return;
		}

		sessionStorage.removeItem('state');

		window.location.hash = sessionStorage.getItem('redirect') || '/';

		resolve(true);
	});
};

export function getUrlParams() {
	const params = location.href.split('?')?.[1]?.split('&');
	if (!params) return null;

	const result: { [key: string]: string } = {};

	params.forEach((p) => {

		const [key, val] = p.split('=');

		result[key] = val.replace(/\+/gu, ' ');
	});

	return result;
}

async function redirectToOAuth(prompt = false) {

	await generatePKCE().then((pkce) => {

		let redirect = `${originalLocation}/#/oauth/callback`;
		if (isPlatform('capacitor')) {
			redirect = 'nomercy:///logout';
		}

		const queryParams = new URLSearchParams({
			client_id: clientId,
			post_logout_redirect_uri: redirect,
			response_type: 'code',
			scope: 'openid profile email',
			state: pkce.state,
			// id_token_hint: user.value.idToken,
			prompt: prompt
				? 'login'
				: 'none',
		}).toString();

		window.location.href = `${authBaseUrl}logout?${queryParams}`;
	});
}

function requestToken() {
	const requestCode = new URLSearchParams(window.location.hash.split('?')[1]).get('code') as string;

	return apiClient()
		.post<TokenResponse, TokenRequestData>(`${authBaseUrl}token`, {
			grant_type: 'authorization_code',
			client_id: clientId,
			client_secret: clientSecret,
			redirect_uri: `${originalLocation}/#/oauth/callback`,
			code: requestCode,
		}, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		});
}

export function refreshToken() {
	return new Promise((resolve, reject) => {
		setTimeout(async () => {
			const refreshToken = location.search.split('refreshToken=')?.[1]?.split('&')?.[0]
				?? localStorage.getItem('refresh_token')
				?? undefined;

			if (!refreshToken) {
				reject('refreshToken: No refresh token');
				return;
			}

			cdnClient()
				.post<TokenResponse, RefreshTokenRequestData>(`${authBaseUrl}token`, {
					grant_type: 'refresh_token',
					client_id: clientId,
					client_secret: clientSecret,
					refresh_token: refreshToken,
				}, {
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				})
				.then((response) => {
					storeTokens(response.data);
					return resolve(response);
				})
				.catch((error) => {
					console.error(error);
					clearTokens();
					sessionStorage.clear();
					localStorage.clear();
					location.reload();
					return reject(error);
				});
		}, 1500);
	});
}

let refreshInterval: NodeJS.Timeout = <NodeJS.Timeout>{};

export function keepTokenFresh() {
	const expiresIn = 3600;
	clearInterval(refreshInterval);
	refreshInterval = setInterval(() => {
		if (hasValidToken()) {
			refreshToken().then();
		}
	}, expiresIn * 1000);
}

function hasToken() {
	return user.value.accessToken !== null;
}

function hasValidToken() {
	return hasToken()
		&& (user.value.refreshIn - Date.now()) > 5000;
}

export function storeTokens(data: TokenResponse) {

	console.log('storeTokens');
	user.value = {
		...user.value,
		refreshIn: new Date(Date.now() + (data.expires_in * 1000)).getTime(),
		accessToken: data.access_token,
		refreshToken: data.refresh_token,
		idToken: data.id_token,
		expiresIn: data.expires_in,
	};

	localStorage.setItem('access_token', data.access_token);
	localStorage.setItem('refresh_token', data.refresh_token);
	localStorage.setItem('id_token', data.id_token);

	try {
		const decodedToken = parseToken<IDToken>(data.id_token!);

		console.log('decodedToken');
		user.value = {
			...user.value,
			name: decodedToken.display_name,
			email: decodedToken.email,
			id: decodedToken.sub,
			locale: decodedToken.locale,
		};

	} catch (error) {
		console.error(error);
	}

}

export function clearTokens() {
	localStorage.removeItem('access_token');
	localStorage.removeItem('refresh_token');
	localStorage.removeItem('id_token');
}

async function checkAuth(): Promise<boolean | void> {

	if (!window.location.href.includes('oauth/callback')) {
		sessionStorage.setItem('redirect', window.location.hash);
	}

	if (!hasValidToken()) {
		if (sessionStorage.getItem('state')) {
			try {
				const response = await requestToken();
				// alert(JSON.stringify(response.data));
				storeTokens(response.data);

				keepTokenFresh();
			} catch (error) {
				sessionStorage.clear();
				// location.reload();

				await Promise.reject(error);
			}
		} else {
			await redirectToOAuth();
		}
	}

	return Promise.resolve(true);
}

export function logout() {
	redirectToOAuth(false).then();
}

export const isAuthenticated = () => {
	return !!localStorage.getItem('access_token');
};
