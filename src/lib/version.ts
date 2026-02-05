declare const __APP_VERSION__: string;
declare const __BUILD_TIME__: string;

export const APP_VERSION: string = __APP_VERSION__;
export const BUILD_TIME: string = __BUILD_TIME__;

export function isOutdated(serverVersion: string): boolean {
	return serverVersion !== APP_VERSION;
}
