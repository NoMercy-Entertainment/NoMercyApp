import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'tv.nomercy.app',
	appName: 'NoMercy TV',
	webDir: 'docs',
	plugins: {
		Keyboard: {
			resizeOnFullScreen: false,
		},
		EdgeToEdge: {
			backgroundColor: '#000000',
		},
	},
};

export default config;
