import type {KeycloakConfig} from "keycloak-js";

export const suffix = location.hostname.includes('dev')
	|| location.hostname.includes('vscode')
	|| location.hostname.includes('12')
	|| location.hostname.includes('192') ? '-dev' : '';

export const ignoredRedirectQueries = ['letter', 'page', 'season', 'sort', 'type', 'episode'];

export const authBaseUrl = `https://auth${suffix}.nomercy.tv/realms/NoMercyTV/protocol/openid-connect/`;

export const keycloakConfig: KeycloakConfig = {
	clientId: 'nomercy-ui',
	realm: 'NoMercyTV',
	url: `https://auth${suffix}.nomercy.tv`,
};

export const tmdbImageBaseUrl = 'https://image.tmdb.org/t/p';
export const tmdbApiKey = 'ed3bf860adef0537783e4abee86d65af';

export interface EQSliderValues {
	pan: {
		min: number;
		max: number;
		step: number;
		default: number;
	}
	pre: {
		min: number;
		max: number;
		step: number;
		default: number;
	}
	band: {
		min: number;
		max: number;
		step: number;
		default: number;
	}
}

export const equalizerSliderValues: EQSliderValues = {
	pan: {
		min: -1,
		max: 1,
		step: 0.01,
		default: 0,
	},
	pre: {
		min: 0,
		max: 3,
		step: 0.01,
		default: 1,
	},
	band: {
		min: -8,
		max: 8,
		step: 0.01,
		default: 0,
	},
}

export const equalizerBands = [
	{ frequency: 32, gain: equalizerSliderValues.band.default },
	{ frequency: 64, gain: equalizerSliderValues.band.default },
	{ frequency: 125, gain: equalizerSliderValues.band.default },
	{ frequency: 250, gain: equalizerSliderValues.band.default },
	{ frequency: 500, gain: equalizerSliderValues.band.default },
	{ frequency: 1000, gain: equalizerSliderValues.band.default },
	{ frequency: 2000, gain: equalizerSliderValues.band.default },
	{ frequency: 4000, gain: equalizerSliderValues.band.default },
	{ frequency: 8000, gain: equalizerSliderValues.band.default },
	{ frequency: 16000, gain: equalizerSliderValues.band.default },
];