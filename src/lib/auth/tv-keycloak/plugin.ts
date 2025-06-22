import type { Plugin } from 'vue';
import { defaultInitConfig } from './const';
import { createKeycloak, initKeycloak } from './keycloak';
import { isFunction, isNil, isPromise, isString } from './utils';
import { loadJsonConfig } from './config';

interface KeycloakPluginConfig {
	config: Keycloak.KeycloakConfig;
	initOptions?: Keycloak.KeycloakInitOptions;
}

type KeycloakConfigFactory = () => KeycloakPluginConfig;
type KeycloakConfigAsyncFactory = () => Promise<KeycloakPluginConfig>;

type VueKeycloakPluginConfig
  = | string
  	| KeycloakPluginConfig
  	| KeycloakConfigFactory
  	| KeycloakConfigAsyncFactory;

export const vueKeycloak: Plugin = {
	async install(app, options: VueKeycloakPluginConfig) {
		if (isNil(options)) {
			throw new Error('The Keycloak.KeycloakConfig are requried');
		}

		let keycloakPluginConfig: KeycloakPluginConfig;
		if (isString(options)) {
			keycloakPluginConfig = await loadJsonConfig(options as string);
		}
		else if (isPromise(options) || isFunction(options)) {
			keycloakPluginConfig = await (options as KeycloakConfigAsyncFactory)();
		}
		else {
			keycloakPluginConfig = options as KeycloakPluginConfig;
		}

		const keycloakConfig = keycloakPluginConfig.config;
		const keycloakInitOptions: Keycloak.KeycloakInitOptions = isNil(
			keycloakPluginConfig.initOptions,
		)
			? defaultInitConfig
			: { ...defaultInitConfig, ...keycloakPluginConfig.initOptions };

		if (!app.config.globalProperties.$keycloak) {
			// @ts-ignore
			app.config.globalProperties.$keycloak = createKeycloak(keycloakConfig);
		}

		await initKeycloak(keycloakInitOptions);
	},
};

export default vueKeycloak;
