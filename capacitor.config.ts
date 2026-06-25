import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vmedis.mobile',
  appName: 'Vmedis Mobile',
  webDir: 'out',
  server: {
    url: 'https://next-vmob-app.vercel.app',
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e3a8a',
      showSpinner: false,
    },
  },
};

export default config;
