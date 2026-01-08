import getLibraries from '@/lib/middleware/getLibraries';
import getLocations from '@/lib/middleware/getLocations';
import initializeAudioPlayer from '@/lib/middleware/inititalizeAudioPlayer';
import initializeVideoSocket from '@/lib/middleware/initializeVideoSocket';
import initializeMusicSocket from '@/lib/middleware/initializeMusicSocket';
import getServerPermissions from '@/lib/middleware/getServerPermissions';
import getServerSetup from '@/lib/middleware/getServerSetup';
import { storeUserDetails } from '@/lib/middleware/storeUserDetails';
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
