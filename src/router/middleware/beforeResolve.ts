import getLibraries from '@/lib/middleware/getLibraries';
import getLocations from '@/lib/middleware/getLocations';
import initializeAudioPlayer from '@/lib/middleware/inititalizeAudioPlayer';
import initializeSocket from '@/lib/middleware/initializeSocket';
import {storeUserDetails} from '@/lib/middleware/storeUserDetails';
// import handleRedirects from "@/lib/middleware/handleRedirects";

const promises: Array<() => Promise<void>> = [
	storeUserDetails,
	getLocations,
	getLibraries,
	initializeSocket,
	initializeAudioPlayer,
	// handleRedirects,
];

export default promises;
