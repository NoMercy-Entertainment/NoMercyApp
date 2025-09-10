/* ============
 * Keycloak
 * ============
 *
 * Keycloak comes with a client-side JavaScript library that can be used to secure HTML5/JavaScript applications.
 * The JavaScript adapter has built-in support for Cordova applications.
 *
 * https://www.keycloak.org/docs/latest/securing_apps/#_javascript_adapter
 */

import { vueKeycloak } from './plugin';

export * from './composable';
export { getKeycloak, getToken, isTokenReady } from './keycloak';
export * from './plugin';

export default vueKeycloak;
