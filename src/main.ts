import { createApp } from 'vue';
import { isPlatform } from '@ionic/vue';
import { App } from "@capacitor/app";

import { isTv } from '@/config/global';
import '@/store/deviceInfo';
import { lockPortrait } from '@/lib/utils';
import {setUser, setUserFromKeycloak, user} from '@/store/user';
import { preloadService } from '@/services/PreloadService';
import * as Sentry from '@sentry/vue';
import router from "@/router";

let redirectUri = `nomercy://home`;
if (location.href.includes('logout')) {
	redirectUri = `nomercy:///logout`;
}
App.addListener('appUrlOpen', async (data) => {
	console.log('App opened with URL: ', data.url);
	redirectUri = data.url;
	router.isReady().then(async () => {
		await router.replace(data.url.replace('nomercy://', ''));
	});
}).then();

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */
import '@ionic/vue/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import './theme/app.scss';

// Lazy load swiper styles when needed
import('swiper/css');
import('swiper/element/css/keyboard');

import AppComponent from './App.vue';
import { parseToken } from './lib/auth/helpers';
import { useOnline } from '@vueuse/core';
import { pwaMessages } from './i18n/pwa';
import {redirectUrl} from "@/store/routeState";

function getCurrentLanguage(): string {
	return localStorage.getItem('language') ||
		navigator.language.split('-')[0] ||
		'en';
}

const lang = getCurrentLanguage();
const messages = pwaMessages[lang as keyof typeof pwaMessages] || pwaMessages.en;

const app = createApp(AppComponent);

const refreshToken = location.search.includes('refreshToken')
	? location.search.split('refreshToken=')[1].split('&')[0]
	: localStorage.getItem('refresh_token') || undefined;

redirectUrl.value = window.location.pathname;

const onlineStatus = useOnline();

// Initialize preloading service early
preloadService.init(); // Re-enabled after fixing TS config

async function initializeAuth() {
  // Lazy load auth modules only when needed
  const { keycloakConfig } = await import('@/config/config');
  
  return { keycloakConfig };
}

async function setupApplication() {
  const { setupApp } = await import('./setupApp');
  return setupApp(app);
}

async function initializeOfflineApp() {
  if (!onlineStatus.value) {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken) {
      const tokenParsed = parseToken(accessToken);

      setUser({
        ...user.value,
        name: tokenParsed.display_name,
        email: tokenParsed.email,
        id: tokenParsed.sub,
        accessToken: accessToken,
        locale: tokenParsed.locale,
        moderator: tokenParsed.realm_access.roles.includes('nova'),
      });

      await setupApplication();
    } else {
      document.body.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column;">
          <h1>${messages.offline}</h1>
          <p>${messages.offlineMessage}</p>
          <button onclick="location.reload()">${messages.reload}</button>
        </div>
      `;
    }
  }
}

async function initializeMobileApp() {
  if (isPlatform('capacitor') && !isTv.value && !localStorage.getItem('access_token')) {
    await lockPortrait();
      const [MobileKeycloak, configModule] = await Promise.all([
      import('@/lib/auth/mobile-keycloak').then(m => m.default),
      import('@/config/config')
    ]);
    
    app.use(MobileKeycloak, {
      init: {
        refreshToken: localStorage.getItem('refresh_token') || undefined,
        onLoad: 'login-required',
        checkLoginIframe: false,
        enableLogging: true,
        adapter: 'capacitor-native',
        responseMode: 'query',
        redirectUri: `nomercy://home`,
      },
      config: configModule.keycloakConfig,
      onReady: async (data: any) => {
        setUserFromKeycloak(data);
        await setupApplication();
      }
    });
  }
}

async function initializeWebApp() {
  if (!isPlatform('capacitor') && !location.search.includes('refreshToken')) {    const [WebKeycloak, configModule] = await Promise.all([
      import('@dsb-norge/vue-keycloak-js').then(m => m.default),
      import('@/config/config')
    ]);
    
    app.use(WebKeycloak, {
      init: {
        onLoad: 'login-required',
        checkLoginIframe: false,
        enableLogging: true,
        responseMode: 'query',
        redirectUri: `${window.location.href || '#/'}${window.location.hash.includes('?') ? '' : '?'}`,
      },
      config: configModule.keycloakConfig,
      onReady: async (data: any) => {
        setUserFromKeycloak(data);
        await setupApplication();
      }
    });
  }
}

async function initializeCastApp() {
  if (!isPlatform('capacitor') && location.search.includes('refreshToken')) {    const [TvKeycloak, configModule] = await Promise.all([
      import('@/lib/auth/tv-keycloak').then(m => m.default),
      import('@/config/config')
    ]);
    
    app.use(TvKeycloak, {
      initOptions: {
        refreshToken: refreshToken,
        onLoad: 'check-sso',
        checkLoginIframe: false,
        enableLogging: true,
        pkceMethod: 'S256',
        silentCheckSsoFallback: true,
        redirectUri: `${window.location.href || '#/'}${window.location.hash.includes('?') ? '' : '?'}`,
      },
      config: configModule.keycloakConfig,
    });

    location.href = "nomercy://home";
    await setupApplication();
  }
}

async function initializeTvApp() {
  const [TvKeycloak, configModule] = await Promise.all([
    import('@/lib/auth/tv-keycloak').then(m => m.default),
    import('@/config/config')
  ]);
  app.use(TvKeycloak, {
    initOptions: {
      refreshToken: localStorage.getItem('refresh_token') || undefined,
      onLoad: 'login-required',
      checkLoginIframe: false,
      enableLogging: true,
      adapter: 'cordova-native',
      responseMode: 'query',
      redirectUri: redirectUri,
      pkceMethod: 'S256',
      silentCheckSsoFallback: true,
    },
    config: configModule.keycloakConfig,
  });

  await setupApplication();
}

// Main initialization logic
async function initialize() {
  try {
    if (!onlineStatus.value) {
      await initializeOfflineApp();
    } else if (isPlatform('capacitor') && !isTv.value && !localStorage.getItem('access_token')) {
      await initializeMobileApp();
    } else if (!isPlatform('capacitor') && !location.search.includes('refreshToken')) {
      await initializeWebApp();
    } else if (!isPlatform('capacitor') && location.search.includes('refreshToken')) {
      await initializeCastApp();
    } else {
      await initializeTvApp();
    }
  } catch (error) {
    console.error('Failed to initialize app:', error);
    
    // Fallback initialization
    document.body.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; flex-direction: column;">
        <h1>Failed to load application</h1>
        <p>Please check your connection and try again.</p>
        <button onclick="location.reload()">Reload</button>
      </div>
    `;
  }
}

// Start the application
initialize();

// Initialize Sentry in production
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN,
    sendDefaultPii: false,
    tracesSampleRate: 0.1,
  });
}