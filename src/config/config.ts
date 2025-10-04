import type { KeycloakConfig } from 'keycloak-js';

export const siteTitle = 'NoMercy TV';

export const suffix
	= location.hostname.includes('dev')
		|| location.hostname.includes('vscode')
		|| location.hostname.includes('12')
		|| location.hostname.includes('192')
		? '-dev'
		: '';

export const authBaseUrl = `https://auth${suffix}.nomercy.tv/realms/NoMercyTV/protocol/openid-connect/`;

export const keycloakConfig: KeycloakConfig = {
	clientId: 'nomercy-ui',
	realm: 'NoMercyTV',
	url: `https://auth${suffix}.nomercy.tv`,
};

export const tmdbImageBaseUrl = 'https://image.tmdb.org/t/p';
export const tmdbApiKey = 'ed3bf860adef0537783e4abee86d65af';

export const libraryTypes = [
	{
		name: 'Movies',
		value: 'movie',
	},
	{
		name: 'TV Shows',
		value: 'tv',
	},
	{
		name: 'Music',
		value: 'music',
	},
	// {
	// 	name: 'Audio Books',
	// 	value: 'book',
	// },
	{
		name: 'Images',
		value: 'image',
	},
];
