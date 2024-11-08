import getLibraries from '@/lib/middleware/getLibraries';
import getLocations from '@/lib/middleware/getLocations';
// import initializeAudioPlayer from '@/lib/middleware/inititalizeAudioPlayer';

const promises: Array<() => Promise<void>> = [
	getLocations,
	getLibraries,
	// initializeAudioPlayer,
];

export default promises;
