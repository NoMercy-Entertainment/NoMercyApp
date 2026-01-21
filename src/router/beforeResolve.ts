import getLibraries from '@/router/middleware/getLibraries';
import getLocations from '@/router/middleware/getLocations';
import initializeAudioPlayer from '@/router/middleware/inititalizeAudioPlayer';
import initializeVideoSocket from '@/router/middleware/initializeVideoSocket';
import initializeMusicSocket from '@/router/middleware/initializeMusicSocket';
import getServerPermissions from '@/router/middleware/getServerPermissions';
import getServerSetup from '@/router/middleware/getServerSetup';
import { storeUserDetails } from '@/router/middleware/storeUserDetails';
import type { MiddlewareConfig } from './handlePromises';

const middlewareConfig: MiddlewareConfig = {
	// Must run first to establish user context
	sequential: [
		storeUserDetails,
		getLocations,
	],
	// Can run in parallel after user/server context is established
	parallel: [
		getServerPermissions,
		getServerSetup,
		getLibraries,
	],
	// Non-critical, can be deferred until after render
	deferred: [
		initializeAudioPlayer,
		initializeVideoSocket,
		initializeMusicSocket,
	],
};

export default middlewareConfig;
