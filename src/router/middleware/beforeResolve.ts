import getLibraries from '@/lib/middleware/getLibraries';
import getLocations from '@/lib/middleware/getLocations';
import initializeAudioPlayer from '@/lib/middleware/inititalizeAudioPlayer';
import initializeSocket from '@/lib/middleware/initializeSocket';
import { storeUserDetails } from '@/lib/middleware/storeUserDetails';
import initializeMusicSocket from "@/lib/middleware/initializeMusicSocket";
import getServerPermissions from "@/lib/middleware/getServerPermissions";

const promises: Array<() => Promise<void>> = [
	storeUserDetails,
	getLocations,
	getServerPermissions,
	getLibraries,
	initializeSocket,
	initializeMusicSocket,
	initializeAudioPlayer,
];

export default promises;
