import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'tv.nomercy.app',
  appName: 'NoMercy TV',
  webDir: 'docs',
  cordova: {},
  server:{
    url: 'https://vue-dev.nomercy.tv',
    // androidScheme: 'nomercy',
    // iosScheme: 'nomercy',
  }
};

export default config;