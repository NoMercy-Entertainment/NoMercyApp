import jwtDecode from './jwt-decode';
import type { DecodedToken } from './index.d';

export function generateCodeVerifier(length: number) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return result;
}

export async function generateCodeChallenge(codeVerifier: string) {

	const encoder = new TextEncoder();
	const data = encoder.encode(codeVerifier);
	const hashBuffer = await window.crypto.subtle?.digest('SHA-256', data);
	if (!hashBuffer) {
		return '';
	}
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashBase64 = base64URLEncode(hashArray);
	return hashBase64;
}

export function base64URLEncode(data: number[]) {
	return btoa(String.fromCharCode.apply(null, data))
		.replace(/\+/gu, '-')
		.replace(/\//gu, '_')
		.replace(/[=]/gu, '');
}

export async function generatePKCE() {
	const state = generateCodeVerifier(40);
	const codeVerifier = generateCodeVerifier(128);

	sessionStorage.setItem('state', state);
	sessionStorage.setItem('code_verifier', codeVerifier);

	const codeChallenge = await generateCodeChallenge(codeVerifier);

	return {
		state: state,
		codeVerifier: codeVerifier,
		codeChallenge: codeChallenge,
	};
}

export function parseToken<T = DecodedToken>(token: string) {

	return jwtDecode(token) as T;
}
