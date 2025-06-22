import getLibraries from '@/lib/middleware/getLibraries';
import getLocations from '@/lib/middleware/getLocations';
import initializeAudioPlayer from '@/lib/middleware/inititalizeAudioPlayer';
import initializeVideoSocket from '@/lib/middleware/initializeVideoSocket';
import initializeMusicSocket from '@/lib/middleware/initializeMusicSocket';
import getServerPermissions from '@/lib/middleware/getServerPermissions';
import { storeUserDetails } from '@/lib/middleware/storeUserDetails';

const promises: Array<() => Promise<void>> = [
	storeUserDetails,
	getLocations,
	getServerPermissions,
	getLibraries,
	initializeVideoSocket,
	initializeMusicSocket,
	initializeAudioPlayer,
];

export default promises;
