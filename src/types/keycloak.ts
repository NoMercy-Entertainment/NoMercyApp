import {
	KeycloakConfig, KeycloakError,
	KeycloakInitOptions,
	KeycloakLoginOptions, KeycloakProfile,
	KeycloakPromise,
	KeycloakResourceAccess,
	KeycloakRoles
} from 'keycloak-js';
import {
	KeycloakAccountOptions, KeycloakFlow,
	KeycloakLogoutOptions,
	KeycloakRegisterOptions,
	KeycloakResponseMode, KeycloakResponseType
} from 'keycloak-ionic';

declare class Keycloak {
	ready?: boolean; // Flag indicating whether Keycloak has initialised and is ready
	authenticated: boolean;
	userName?: string; // Username from Keycloak. Collected from tokenParsed['preferred_username']
	fullName?: string; // Full name from Keycloak. Collected from tokenParsed['name']
	login?(options?: KeycloakLoginOptions): KeycloakPromise<void, void>; // [Keycloak] login function
	loginFn?(options?: KeycloakLoginOptions): KeycloakPromise<void, void>; // Alias for login
	// This is not defined in keycloak
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	logoutFn?(options?: any): KeycloakPromise<void, void> | void; // Keycloak logout function
	createLoginUrl(options?: KeycloakLoginOptions): string; // Keycloak createLoginUrl function
	// This is not defined in keycloak
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	createLogoutUrl(options?: any): string; // Keycloak createLogoutUrl function
	createRegisterUrl(options?: KeycloakLoginOptions): string; // Keycloak createRegisterUrl function
	register(options?: KeycloakLoginOptions): KeycloakPromise<void, void>; // Keycloak register function
	accountManagement(): KeycloakPromise<void, void>; // Keycloak accountManagement function
	createAccountUrl(): string; // Keycloak createAccountUrl function
	loadUserProfile(): KeycloakPromise<KeycloakProfile, void>; // Keycloak loadUserProfile function
	subject: string; // The user id
	idToken: string; // The base64 encoded ID token.
	idTokenParsed: IDTokenParsed; // The parsed id token as a JavaScript object.
	realmAccess: RealmAccess; // The realm roles associated with the token.
	resourceAccess: ResourceAccess; // The resource roles associated with the token.
	refreshToken: string; // The base64 encoded refresh token that can be used to retrieve a new token.
	refreshTokenParsed: RefreshTokenParsed; // The parsed refresh token as a JavaScript object.
	timeSkew: number; // The estimated time difference between the browser time and the Keycloak server in seconds. This value is just an estimation, but is accurate enough when determining if a token is expired or not.
	responseMode: string; // Response mode passed in init (default value is fragment).
	responseType: string; // Response type sent to Keycloak with login requests. This is determined based on the flow value used during initialization, but can be overridden by setting this value.
	hasRealmRole(role: string): boolean; // Keycloak hasRealmRole function
	hasResourceRole(role: string, resource?: string): boolean; // Keycloak hasResourceRole function
	token: string; // The base64 encoded token that can be sent in the Authorization header in requests to services
	tokenParsed: TokenParsed; // The parsed token as a JavaScript object
	keycloak: KeycloakInstance; // The original keycloak instance 'as is' from keycloak-js adapter

	loginRequired: boolean;
	redirectUri: string;
	silentCheckSsoFallback?: boolean;
	enableLogging?: boolean;
	messageReceiveTimeout?: number;
	flow: string;
	clientId: string;
	authServerUrl: string;
	realm: string;
	endpoints?: Endpoints;
	sessionId: string;
}

declare function Keycloak(config?: KeycloakConfig | string): Keycloak;

export default Keycloak;

export interface Endpoints {
}

export interface RealmAccess {
	roles: string[];
}

export interface ResourceAccess {
	'nomercy-api': RealmAccess;
	'realm-management': RealmAccess;
	account: RealmAccess;
	'nomercy-server': RealmAccess;
}

export interface IDTokenParsed {
	exp: number;
	iat: number;
	auth_time: number;
	jti: string;
	iss: string;
	aud: string;
	sub: string;
	typ: string;
	azp: string;
	nonce: string;
	session_state: string;
	at_hash: string;
	sid: string;
	email_verified: boolean;
	name: string;
	preferred_username: string;
	locale: string;
	given_name: string;
	display_name: string;
	family_name: string;
	email: string;
	[key: string]: any; // Add other attributes here.
}

export interface TokenParsed {
	exp: number;
	iat: number;
	auth_time: number;
	jti: string;
	iss: string;
	aud: string[];
	sub: string;
	typ: string;
	azp: string;
	nonce: string;
	session_state: string;
	'allowed-origins': string[];
	realm_access: RealmAccess;
	resource_access: ResourceAccess;
	scope: string;
	sid: string;
	email_verified: boolean;
	name: string;
	preferred_username: string;
	locale: string;
	given_name: string;
	display_name: string;
	family_name: string;
	email: string;
	[key: string]: any; // Add other attributes here.
}

export interface RefreshTokenParsed {
	exp: number;
	iat: number;
	jti: string;
	iss: string;
	aud: string;
	sub: string;
	typ: string;
	azp: string;
	nonce: string;
	session_state: string;
	scope: string;
	sid: string;
}

/**
 * A client for the Keycloak authentication server.
 * @see {@link https://keycloak.gitbooks.io/securing-client-applications-guide/content/topics/oidc/javascript-adapter.html|Keycloak JS adapter documentation}
 */
declare class KeycloakInstance {
	/**
	 * Creates a new Keycloak client instance.
	 * @param config A configuration object or path to a JSON config file.
	 */
	constructor(config?: KeycloakConfig | string)

	/**
	 * Is true if the user is authenticated, false otherwise.
	 */
	authenticated?: boolean;

	/**
	 * The user id.
	 */
	subject?: string;

	/**
	 * Response mode passed in init (default value is `'fragment'`).
	 */
	responseMode?: KeycloakResponseMode;

	/**
	 * Response type sent to Keycloak with login requests. This is determined
	 * based on the flow value used during initialization, but can be overridden
	 * by setting this value.
	 */
	responseType?: KeycloakResponseType;

	/**
	 * Flow passed in init.
	 */
	flow?: KeycloakFlow;

	/**
	 * The realm roles associated with the token.
	 */
	realmAccess?: KeycloakRoles;

	/**
	 * The resource roles associated with the token.
	 */
	resourceAccess?: KeycloakResourceAccess;

	/**
	 * The base64 encoded token that can be sent in the Authorization header in
	 * requests to services.
	 */
	token?: string;

	/**
	 * The parsed token as a JavaScript object.
	 */
	tokenParsed?: TokenParsed;

	/**
	 * The base64 encoded refresh token that can be used to retrieve a new token.
	 */
	refreshToken?: string;

	/**
	 * The parsed refresh token as a JavaScript object.
	 */
	refreshTokenParsed?: TokenParsed;

	/**
	 * The base64 encoded ID token.
	 */
	idToken?: string;

	/**
	 * The parsed id token as a JavaScript object.
	 */
	idTokenParsed?: TokenParsed;

	/**
	 * The estimated time difference between the browser time and the Keycloak
	 * server in seconds. This value is just an estimation, but is accurate
	 * enough when determining if a token is expired or not.
	 */
	timeSkew?: number;

	/**
	 * @private Undocumented.
	 */
	loginRequired?: boolean;

	/**
	 * @private Undocumented.
	 */
	authServerUrl?: string;

	/**
	 * @private Undocumented.
	 */
	realm?: string;

	/**
	 * @private Undocumented.
	 */
	clientId?: string;

	/**
	 * @private Undocumented.
	 */
	clientSecret?: string;

	/**
	 * @private Undocumented.
	 */
	redirectUri?: string;

	/**
	 * @private Undocumented.
	 */
	sessionId?: string;

	/**
	 * @private Undocumented.
	 */
	profile?: KeycloakProfile;

	/**
	 * @private Undocumented.
	 */
	userInfo?: NonNullable<unknown>; // KeycloakUserInfo;

	/**
	 * Called when the adapter is initialized.
	 */
	onReady(authenticated?: boolean): void;

	/**
	 * Called when a user is successfully authenticated.
	 */
	onAuthSuccess(): void;

	/**
	 * Called if there was an error during authentication.
	 */
	onAuthError(errorData: KeycloakError): void;

	/**
	 * Called when the token is refreshed.
	 */
	onAuthRefreshSuccess(): void;

	/**
	 * Called if there was an error while trying to refresh the token.
	 */
	onAuthRefreshError(): void;

	/**
	 * Called if the user is logged out (will only be called if the session
	 * status iframe is enabled, or in Cordova mode).
	 */
	onAuthLogout(): void;

	/**
	 * Called when the access token is expired. If a refresh token is available
	 * the token can be refreshed with Keycloak#updateToken, or in cases where
	 * it's not (ie. with implicit flow) you can redirect to login screen to
	 * obtain a new access token.
	 */
	onTokenExpired(): void;

	/**
	 * Called when a AIA has been requested by the application.
	 */
	onActionUpdate(status: 'success' | 'cancelled' | 'error'): void;

	/**
	 * Called to initialize the adapter.
	 * @param initOptions Initialization options.
	 * @returns A promise to set functions to be invoked on success or error.
	 */
	init(initOptions: KeycloakInitOptions): KeycloakPromise<boolean, KeycloakError>;

	/**
	 * Redirects to login form.
	 * @param options Login options.
	 */
	login(options?: KeycloakLoginOptions): KeycloakPromise<void, void>;

	/**
	 * Redirects to logout.
	 * @param options Logout options.
	 */
	logout(options?: KeycloakLogoutOptions): KeycloakPromise<void, void>;

	/**
	 * Redirects to registration form.
	 * @param options The options used for the registration.
	 */
	register(options?: KeycloakRegisterOptions): KeycloakPromise<void, void>;

	/**
	 * Redirects to the Account Management Console.
	 */
	accountManagement(): KeycloakPromise<void, void>;

	/**
	 * Returns the URL to login form.
	 * @param options Supports same options as Keycloak#login.
	 */
	createLoginUrl(options?: KeycloakLoginOptions): string;

	/**
	 * Returns the URL to logout the user.
	 * @param options Logout options.
	 */
	createLogoutUrl(options?: KeycloakLogoutOptions): string;

	/**
	 * Returns the URL to registration page.
	 * @param options The options used for creating the registration URL.
	 */
	createRegisterUrl(options?: KeycloakRegisterOptions): string;

	/**
	 * Returns the URL to the Account Management Console.
	 * @param options The options used for creating the account URL.
	 */
	createAccountUrl(options?: KeycloakAccountOptions): string;

	/**
	 * Returns true if the token has less than `minValidity` seconds left before
	 * it expires.
	 * @param minValidity If not specified, `0` is used.
	 */
	isTokenExpired(minValidity?: number): boolean;

	/**
	 * If the token expires within `minValidity` seconds, the token is refreshed.
	 * If the session status iframe is enabled, the session status is also
	 * checked.
	 * @returns A promise to set functions that can be invoked if the token is
	 *          still valid, or if the token is no longer valid.
	 * @example
	 * ```js
	 * keycloak.updateToken(5).then(function(refreshed) {
	 *   if (refreshed) {
	 *     alert('Token was successfully refreshed');
	 *   } else {
	 *     alert('Token is still valid');
	 *   }
	 * }).catch(function() {
	 *   alert('Failed to refresh the token, or the session has expired');
	 * });
	 */
	updateToken(minValidity: number): KeycloakPromise<boolean, boolean>;

	/**
	 * Clears authentication state, including tokens. This can be useful if
	 * the application has detected the session was expired, for example if
	 * updating token fails. Invoking this results in Keycloak#onAuthLogout
	 * callback listener being invoked.
	 */
	clearToken(): void;

	/**
	 * Returns true if the token has the given realm role.
	 * @param role A realm role name.
	 */
	hasRealmRole(role: string): boolean;

	/**
	 * Returns true if the token has the given role for the resource.
	 * @param role A role name.
	 * @param resource If not specified, `clientId` is used.
	 */
	hasResourceRole(role: string, resource?: string): boolean;

	/**
	 * Loads the user's profile.
	 * @returns A promise to set functions to be invoked on success or error.
	 */
	loadUserProfile(): KeycloakPromise<KeycloakProfile, void>;

	/**
	 * @private Undocumented.
	 */
	loadUserInfo(): KeycloakPromise<NonNullable<unknown>, void>;
}
