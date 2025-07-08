import getLibraries from '@/lib/middleware/getLibraries';
import getLocations from '@/lib/middleware/getLocations';
import initializeAudioPlayer from '@/lib/middleware/inititalizeAudioPlayer';
import initializeVideoSocket from '@/lib/middleware/initializeVideoSocket';
import initializeMusicSocket from '@/lib/middleware/initializeMusicSocket';
import getServerPermissions from '@/lib/middleware/getServerPermissions';
import getServerSetup from '@/lib/middleware/getServerSetup';
import { storeUserDetails } from '@/lib/middleware/storeUserDetails';

const promises: Array<() => Promise<void>> = [
	storeUserDetails,
	getLocations,
	getServerPermissions,
	getServerSetup,
	getLibraries,
	initializeVideoSocket,
	initializeMusicSocket,
	initializeAudioPlayer,
];

export default promises;
