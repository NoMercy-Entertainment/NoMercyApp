# Product Requirements Document: NoMercy App Performance Overhaul

**Document Version:** 1.0
**Date:** 2025-02-05
**Project:** NoMercy.App Vue Performance Optimization
**Repository:** C:\Projects\NoMercy\NoMercy.App

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Performance Metrics & Targets](#performance-metrics--targets)
4. [API & Authentication](#api--authentication)
5. [Critical Issues](#critical-issues)
6. [Implementation Phases](#implementation-phases)
7. [Technical Specifications](#technical-specifications)
8. [File Reference Guide](#file-reference-guide)
9. [Testing & Validation](#testing--validation)

---

## Executive Summary

The NoMercy.App is a Vue 3 + Vite multimedia platform that currently suffers from significant performance issues, primarily due to bundle bloat, inefficient code splitting, and suboptimal asset loading strategies. This PRD outlines a comprehensive overhaul to achieve fast, snappy performance comparable to leading web applications.

### Key Objectives

- Reduce initial bundle size from **3MB+ to under 500KB** (gzipped)
- Achieve **First Contentful Paint (FCP) under 1.5 seconds**
- Achieve **Largest Contentful Paint (LCP) under 2.5 seconds**
- Achieve **Time to Interactive (TTI) under 3.5 seconds**
- Eliminate render-blocking resources
- Implement efficient lazy loading throughout

---

## Current State Analysis

### Application Architecture

```
src/
├── components/        # 100+ reusable components (many globally registered)
├── composables/       # Performance monitoring, responsive design
├── config/           # App configuration, i18next, TanStack Query
├── hooks/            # Chrome Cast, SignalR listeners
├── Layout/           # Desktop & Mobile base layouts
├── lib/              # Utilities, service worker, API clients
├── router/           # Vue Router with 50+ routes
├── services/         # PreloadService, IconOptimizationService
├── store/            # Vue Ref-based state (25 stores)
├── views/            # Feature views organized by domain
└── main.ts           # Application entry point
```

### Current Bundle Analysis

| Chunk | Uncompressed | Gzipped | Status |
|-------|--------------|---------|--------|
| index (main) | 3,043 KB | 778 KB | **CRITICAL** |
| VideoPlayer | 845 KB | 359 KB | High Priority |
| esm (Ionic) | 361 KB | 124 KB | High Priority |
| setupApp | 349 KB | 74 KB | Medium Priority |
| auto (PrimeVue) | 207 KB | 71 KB | Medium Priority |
| swiper-element | 110 KB | 30 KB | Duplicate |
| swiper-vue | 89 KB | 27 KB | Duplicate |
| BaseLayout (Desktop) | 144 KB | 58 KB | Medium Priority |

**Total Initial Load:** ~1.2MB gzipped (excluding images/fonts)

### Technology Stack

- **Framework:** Vue 3.5.21 with Composition API
- **Build Tool:** Vite (rolldown-vite)
- **UI Framework:** Ionic Vue 8.7.3
- **Component Library:** PrimeVue 4.3.9
- **State Management:** Vue Refs (no Pinia/Vuex)
- **Data Fetching:** TanStack Vue Query 5.87.1
- **Carousel:** Swiper 11.2.10
- **Styling:** Tailwind CSS 3 + SCSS
- **PWA:** vite-plugin-pwa 1.0.3
- **Real-time:** SignalR 9.0.6

---

## Performance Metrics & Targets

### Core Web Vitals Targets

| Metric | Current (Estimated) | Target | Priority |
|--------|---------------------|--------|----------|
| First Contentful Paint | 3-4s | < 1.5s | Critical |
| Largest Contentful Paint | 5-7s | < 2.5s | Critical |
| Cumulative Layout Shift | 0.15+ | < 0.1 | High |
| First Input Delay | 200ms+ | < 100ms | High |
| Time to Interactive | 8-10s | < 3.5s | Critical |
| Total Blocking Time | 1000ms+ | < 300ms | High |

### Bundle Size Targets

| Category | Current | Target |
|----------|---------|--------|
| Initial JS (gzipped) | ~780KB | < 150KB |
| Initial CSS (gzipped) | ~50KB | < 30KB |
| Total Initial Load | ~1.2MB | < 300KB |
| Largest Chunk | 3MB | < 250KB |

---

## API & Authentication

### API Endpoints

**Base API URL:** Dynamic per server, stored in `currentServer.value.serverApiUrl`

**Swagger Documentation:**
```
https://192-168-2-201.fcbb730a-a562-2ca5-d054-5d6acf2a1aaa.nomercy.tv:7626/swagger/v1/swagger.json
```

**Development App URL:**
```
https://app-dev.nomercy.tv
```

### Authentication Token Location

**CRITICAL: Never hardcode tokens in source code**

The bearer token is stored at:
```
C:\Users\patri\AppData\Local\NoMercy_dev\config\token.json
```

**Token Structure:**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 864000,
  "id_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "scope": "openid profile offline_access email",
  "token_type": "Bearer"
}
```

**How to Read Token Programmatically (for testing/API calls):**
```bash
# PowerShell
$token = (Get-Content "C:\Users\patri\AppData\Local\NoMercy_dev\config\token.json" | ConvertFrom-Json).access_token

# Bash/WSL
token=$(cat /mnt/c/Users/patri/AppData/Local/NoMercy_dev/config/token.json | jq -r '.access_token')

# Usage in curl
curl -H "Authorization: Bearer $token" https://api-endpoint...
```

**Authentication Flow:**
1. User authenticates via Keycloak (auth-dev.nomercy.tv)
2. Token stored in local config file
3. App reads token on startup
4. Token refreshed automatically via Keycloak SDK

### API Request Headers

```typescript
{
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json',
  'Accept-Language': displayLanguage.value
}
```

---

## Critical Issues

### Issue #1: Massive Main Bundle (CRITICAL)

**Location:** Build output `docs/assets/index-*.js`
**Size:** 3,043 KB uncompressed, 778 KB gzipped
**Impact:** 5-10 second initial load times

**Root Causes:**
1. All global component registrations bundled together
2. Heavy dependencies not code-split (Ionic, PrimeVue, Swiper)
3. No manual chunk configuration

**Files Affected:**
- `src/setupApp.ts` (lines 40-151)
- `vite.config.ts` (lines 108-127)

---

### Issue #2: Swiper Double-Loading (HIGH)

**Location:** `src/setupApp.ts:59-64`
**Size Waste:** ~100KB duplicate code

**Current Code:**
```typescript
import { Swiper } from 'swiper';
import { SwiperSlide } from 'swiper/vue';
import { register as registerSwiperElements } from 'swiper/element/bundle';
registerSwiperElements(); // Loads web component version
app.component('Swiper', Swiper);  // Also registers Vue version
app.component('SwiperSlide', SwiperSlide);
```

**Problem:** Loading both Vue components AND web component bundle.

---

### Issue #3: Eager Layout Loading (HIGH)

**Location:** `src/router/routes.ts:6-7`

**Current Code:**
```typescript
const MobileBaseLayout = import('@/Layout/Mobile/BaseLayout.vue');
const DesktopBaseLayout = import('@/Layout/Desktop/BaseLayout.vue');
```

**Problem:** These execute immediately, loading BOTH layouts regardless of device.

---

### Issue #4: Global Component Registration (HIGH)

**Location:** `src/setupApp.ts:123-151`

**Current Code:**
```typescript
app.component('Modal', Modal);
app.component('NMCard', NMCard);
app.component('NMCarousel', supportsCarousel ? NMCarousel2 : NMCarousel);
// ... 20+ more components
```

**Problem:** All components bundled into main chunk regardless of usage.

**Solution:** Convert NM components to a local component map with lazy loading in `NMComponent.vue`. Vue's `:is` accepts component objects directly, not just strings. Map API string names to lazy-loaded components.

---

### Issue #5: Inefficient Image Loading (MEDIUM)

**Location:** `src/components/Images/TMDBImage.vue:73-80`

**Current Code:**
```typescript
return `https://app.nomercy.tv/tmdb-images${props.path}?width=${props.size ? props.size * 2 : null}`;
```

**Problems:**
1. Always loading 2x resolution (wasteful on 1x displays)
2. No WebP/AVIF format negotiation
3. No progressive/placeholder loading

---

### Issue #6: Expensive Deep Cloning (MEDIUM)

**Location:** `src/lib/routerHelper.ts:124-127`

**Current Code:**
```typescript
const data = [
    ...(homeData.value?.map((d) => {
        return structuredClone(toRaw(d));
    }) ?? []),
];
```

**Problem:** `structuredClone` on every mutation creates expensive copies.

---

### Issue #7: Router AfterEach Overhead (LOW)

**Location:** `src/Layout/Desktop/components/ScrollContainer.vue:237`

**Current Code:**
```typescript
router.afterEach(enable);
```

**Problem:** Re-initializes scrollbar listeners on every navigation.

---

### Issue #8: VideoPlayer Chunk Size (MEDIUM)

**Location:** Build output `docs/assets/VideoPlayer-*.js`
**Size:** 845 KB uncompressed, 359 KB gzipped

**Problem:** Large chunk causes delay when navigating to watch content.

**Components Included:**
- Video player core
- Subtitle rendering (subtitles-octopus)
- HLS/DASH streaming libraries

---

## Implementation Phases

### Phase 1: Bundle Splitting & Quick Wins (Week 1)

#### 1.1 Configure Manual Chunks

**File:** `vite.config.ts`

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vue-core': ['vue', 'vue-router'],
        'ionic': ['@ionic/vue', '@ionic/vue-router', '@ionic/core'],
        'primevue': ['primevue', '@primevue/themes', '@primeuix/styled'],
        'swiper': ['swiper'],
        'query': ['@tanstack/vue-query'],
        'i18n': ['i18next', 'i18next-vue', 'i18next-http-backend'],
        'signalr': ['@microsoft/signalr'],
        'utils': ['axios', 'clsx', 'tailwind-merge', 'class-variance-authority'],
      },
      chunkFileNames: 'assets/[name]-[hash].js',
    }
  }
}
```

#### 1.2 Fix Layout Imports

**File:** `src/router/routes.ts`

```typescript
// BEFORE
const MobileBaseLayout = import('@/Layout/Mobile/BaseLayout.vue');
const DesktopBaseLayout = import('@/Layout/Desktop/BaseLayout.vue');

// AFTER
const MobileBaseLayout = () => import('@/Layout/Mobile/BaseLayout.vue');
const DesktopBaseLayout = () => import('@/Layout/Desktop/BaseLayout.vue');

function getBaseLayout() {
  return isMobile.value ? MobileBaseLayout : DesktopBaseLayout;
}
```

#### 1.3 Remove Swiper Duplication

**File:** `src/setupApp.ts`

```typescript
// BEFORE
import { Swiper } from 'swiper';
import { SwiperSlide } from 'swiper/vue';
import { register as registerSwiperElements } from 'swiper/element/bundle';
registerSwiperElements();

// AFTER
// Remove registerSwiperElements() and its import entirely
// Import Swiper Vue components locally in components that use them
```

#### 1.4 Add Preconnect Hints

**File:** `index.html`

```html
<head>
  <link rel="preconnect" href="https://media.themoviedb.org" crossorigin>
  <link rel="preconnect" href="https://app.nomercy.tv" crossorigin>
  <link rel="preconnect" href="https://auth-dev.nomercy.tv" crossorigin>
  <link rel="dns-prefetch" href="https://cdn.nomercy.tv">
  <link rel="preload" href="/fonts/Inter-roman.var-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/fonts/mooooom-icons.woff" as="font" type="font/woff" crossorigin>
</head>
```

---

### Phase 2: Component Optimization (Week 2)

#### 2.1 Convert NM Components to Local Component Map with Lazy Loading

The NM components currently use global registration, but Vue's `:is` binding also accepts component objects directly (see [Vue docs](https://vuejs.org/api/built-in-special-elements.html#component)). This allows lazy loading via a local component map.

**Current Implementation (global registration):**
```vue
<component
  :is="render?.component"
  v-for="(render, index) in mutatedData ?? homeData ?? []"
  :key="render.id"
  v-bind="render.props"
/>
```

**New Implementation (local component map with lazy loading):**

**File:** `src/components/NMComponent.vue`

```typescript
import { defineAsyncComponent } from 'vue'

const components = {
  NMCarousel: defineAsyncComponent(() => import('@/components/NMCarousel.vue')),
  NMCarousel2: defineAsyncComponent(() => import('@/components/NMCarousel2.vue')),
  NMCard: defineAsyncComponent(() => import('@/components/NMCard.vue')),
  NMContainer: defineAsyncComponent(() => import('@/components/NMContainer.vue')),
  NMGenreCard: defineAsyncComponent(() => import('@/components/NMGenreCard.vue')),
  NMGrid: defineAsyncComponent(() => import('@/components/NMGrid.vue')),
  NMHomeCard: defineAsyncComponent(() => import('@/components/NMHomeCard.vue')),
  NMList: defineAsyncComponent(() => import('@/components/NMList.vue')),
  NMSeasonCard: defineAsyncComponent(() => import('@/components/NMSeasonCard.vue')),
  NMSeasonTitle: defineAsyncComponent(() => import('@/components/NMSeasonTitle.vue')),
  NMMusicCard: defineAsyncComponent(() => import('@/components/NMMusicCard.vue')),
  NMMusicHomeCard: defineAsyncComponent(() => import('@/components/NMMusicHomeCard.vue')),
  NMServerComponent: defineAsyncComponent(() => import('@/components/NMServerComponent.vue')),
  NMTopResultCard: defineAsyncComponent(() => import('@/components/NMTopResultCard.vue')),
  NMTrackRow: defineAsyncComponent(() => import('@/components/NMTrackRow.vue')),
}
```

```vue
<template>
  <component
    :is="components[render?.component as keyof typeof components]"
    v-for="(render, index) in mutatedData ?? homeData ?? []"
    :key="render.id"
    :index="index"
    v-bind="render.props"
  />
</template>
```

**Then remove global registrations from `src/setupApp.ts`** (lines 123-138).

**Benefits:**
- Components load only when the API requests them
- Reduces initial bundle size
- Each component becomes its own chunk

**Components that CAN also be made local (not used in API responses):**
- Button
- Modal
- Toast
- PrimeVue components (Card, Dialog, InputNumber, etc.)

#### 2.2 Use defineAsyncComponent for Heavy Components

**File:** Create `src/components/async.ts`

```typescript
import { defineAsyncComponent } from 'vue';

export const AsyncVideoPlayer = defineAsyncComponent({
  loader: () => import('@/lib/VideoPlayer/VideoPlayer.vue'),
  loadingComponent: () => import('@/components/Loading/VideoPlayerSkeleton.vue'),
  delay: 200,
  timeout: 30000,
});

export const AsyncMusicPlayer = defineAsyncComponent({
  loader: () => import('@/components/MusicPlayer/MusicPlayer.vue'),
  loadingComponent: () => import('@/components/Loading/MusicPlayerSkeleton.vue'),
  delay: 200,
});

export const AsyncDashboard = defineAsyncComponent({
  loader: () => import('@/views/Dashboard/Dashboard.vue'),
  delay: 200,
});
```

#### 2.3 Implement Component-Level Code Splitting

**File:** `src/components/NMCarousel.vue`

```typescript
<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/css';
</script>
```

---

### Phase 3: Image Optimization (Week 2-3)

#### 3.1 PRESERVE Color Palette Gradient Placeholder

**IMPORTANT:** The current color palette gradient placeholder implementation is a GOOD optimization and should be preserved. It avoids network requests for placeholder images.

**Current Implementation (TMDBImage.vue:86-141) - KEEP THIS:**
```typescript
const style = computed(() => ({
  'backgroundImage': `
    radial-gradient(farthest-corner at top left, ${props.colorPalette?.lightVibrant ?? 'var(--c-1)'}, transparent),
    radial-gradient(farthest-corner at top right, ${props.colorPalette?.dominant ?? 'var(--c-2)'}, transparent),
    radial-gradient(farthest-corner at bottom left, ${props.colorPalette?.darkVibrant ?? 'var(--c-3)'}, transparent),
    radial-gradient(farthest-corner at bottom right, ${props.colorPalette?.dominant ?? 'var(--c-4)'}, transparent)
  `
}));
```

**Why This is Good:**
- API already provides `color_palette` with extracted colors from images
- CSS gradients render instantly (no network request)
- Creates visually appealing placeholder that matches the final image
- Better than blur-up loading which requires loading a tiny image first

**DO NOT replace with blur-up loading** - the current approach is superior.

#### 3.2 Responsive Image Loading (Enhancement)

**File:** `src/components/Images/TMDBImage.vue`

Optimize the size multiplier based on device pixel ratio:

```typescript
<script setup>
const devicePixelRatio = ref(typeof window !== 'undefined' ? window.devicePixelRatio : 1);

const optimizedSize = computed(() => {
  if (!props.size) return 'original';
  const multiplier = devicePixelRatio.value > 1.5 ? 2 : 1;
  return props.size * multiplier;
});

const serverImageUrl = computed(() => {
  if (!props.path || !currentServer.value) return;
  return `https://app.nomercy.tv/tmdb-images${props.path}?width=${optimizedSize.value}&format=webp`;
});

const fallbackUrl = computed(() => {
  if (!props.path || !currentServer.value) return;
  return `https://media.themoviedb.org/t/p/${getCommonSize(props?.size ?? 'original')}${props.path}`;
});
</script>

<template>
  <picture>
    <source :srcset="serverImageUrl" type="image/webp">
    <img :src="fallbackUrl" :loading="loading" :style="style" ... />
  </picture>
</template>
```

#### 3.3 Implement Intersection Observer for Images (Optional Enhancement)

The native `loading="lazy"` is already used. Intersection Observer can provide more control:

```typescript
const imageRef = ref<HTMLImageElement>();
const isVisible = ref(false);

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        isVisible.value = true;
        observer.disconnect();
      }
    },
    { rootMargin: '100px' }
  );

  if (imageRef.value) {
    observer.observe(imageRef.value);
  }
});
```

---

### Phase 4: Data Fetching Optimization (Week 3)

#### 4.1 Optimize TanStack Query Configuration

**File:** `src/config/tanstack-query.ts`

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
    },
  },
});
```

#### 4.2 Replace structuredClone with Targeted Updates

**File:** `src/lib/routerHelper.ts`

```typescript
// BEFORE
const data = [
    ...(homeData.value?.map((d) => {
        return structuredClone(toRaw(d));
    }) ?? []),
];

// AFTER
mutationFn: async (mutations: Component<T>[]) => {
    const mutationIds = new Set(mutations.map(m => m.update?.body?.replace_id));

    const data = homeData.value?.map((d) => {
        if (mutationIds.has(d.id)) {
            return { ...toRaw(d) };
        }
        return d;
    }) ?? [];
};
```

#### 4.3 Implement Request Deduplication

**File:** `src/lib/clients/serverClient.ts`

```typescript
const pendingRequests = new Map<string, Promise<any>>();

export function deduplicatedRequest<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key)!;
  }

  const promise = requestFn().finally(() => {
    pendingRequests.delete(key);
  });

  pendingRequests.set(key, promise);
  return promise;
}
```

---

### Phase 5: Runtime Optimizations (Week 4)

#### 5.1 Optimize ScrollContainer

**File:** `src/Layout/Desktop/components/ScrollContainer.vue`

```typescript
// BEFORE
router.afterEach(enable);

// AFTER
let currentPath = '';
router.afterEach((to) => {
  if (to.path.split('/')[1] === currentPath.split('/')[1]) {
    scrollContainerElement.value?.scrollTo(0, 0);
    return;
  }
  currentPath = to.path;
  enable();
});
```

#### 5.2 Implement Virtual Scrolling for Long Lists

**File:** `src/lib/swiper-config.ts`

```typescript
export function swiperConfig(isBackdrop: boolean) {
  return {
    virtual: {
      enabled: true,
      addSlidesAfter: 2,
      addSlidesBefore: 2,
    },
  };
}
```

#### 5.3 Optimize Reactive Dependencies

**File:** `src/store/ui.ts`

```typescript
import { shallowRef } from 'vue';

const colorPaletteData = shallowRef<PaletteColors | null>(null);
export const colorPalette = computed(() => colorPaletteData.value);

export function setColorPalette(value?: PaletteColors | null) {
  colorPaletteData.value = value;
}
```

---

### Phase 6: Build & Deployment Optimization (Week 4)

#### 6.1 Enable Compression

**File:** `vite.config.ts`

```typescript
import compression from 'vite-plugin-compression';

plugins: [
  compression({ algorithm: 'gzip', ext: '.gz' }),
  compression({ algorithm: 'brotliCompress', ext: '.br' }),
],
```

#### 6.2 Optimize CSS Delivery

**File:** `vite.config.ts`

```typescript
css: {
  devSourcemap: false,
  preprocessorOptions: {
    scss: { api: 'modern-compiler' },
  },
},
build: {
  cssCodeSplit: true,
  cssMinify: 'lightningcss',
},
```

#### 6.3 Configure Optimal Caching Headers

**File:** `public/_headers` (for Netlify/Cloudflare)

```
/
  Cache-Control: no-cache, no-store, must-revalidate

/index.html
  Cache-Control: no-cache, no-store, must-revalidate

/assets/*
  Cache-Control: public, max-age=31536000, immutable  # 1 year

/fonts/*
  Cache-Control: public, max-age=31536000, immutable  # 1 year

/img/*
  Cache-Control: public, max-age=2592000  # 30 days

/sw.js
  Cache-Control: no-cache, no-store, must-revalidate
```

---

### Phase 8: PWA & Cache Invalidation (Critical)

**CRITICAL REQUIREMENT:** Users must NEVER need to manually clear cache or force refresh.

#### Current State

- `registerType: 'prompt'` - Shows notification when update available
- `skipWaiting: false` - Waits for user action
- `serviceWorkerUpdates.ts` - Handles update detection and notification
- Update notification with "Update Now" / "Later" buttons exists

#### Problems to Solve

1. **Stale cache after Cloudflare deploy** - Old JS/CSS served from SW cache
2. **User ignores update notification** - App runs outdated code indefinitely
3. **Keycloak redirect loses update state** - User returns to stale version
4. **No forced update for critical fixes** - Security patches delayed

#### 8.1 Implement Version-Based Cache Busting

**File:** `vite.config.ts`

Inject build version into the app:

```typescript
import { execSync } from 'child_process';

const commitHash = execSync('git rev-parse --short HEAD').toString().trim();
const buildTime = new Date().toISOString();

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(commitHash),
    __BUILD_TIME__: JSON.stringify(buildTime),
  },
});
```

**File:** `src/lib/version.ts`

```typescript
declare const __APP_VERSION__: string;
declare const __BUILD_TIME__: string;

export const APP_VERSION = __APP_VERSION__;
export const BUILD_TIME = __BUILD_TIME__;

export function isOutdated(serverVersion: string): boolean {
  return serverVersion !== APP_VERSION;
}
```

#### 8.2 Server Version Check on App Load

**File:** `src/lib/versionCheck.ts`

```typescript
import { APP_VERSION } from './version';
import { addNotification } from '@/store/notifications';

const VERSION_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
const VERSION_ENDPOINT = '/version.json';

interface VersionInfo {
  version: string;
  buildTime: string;
  forceUpdate?: boolean;
  minVersion?: string;
}

let checkInterval: number | null = null;

export async function checkForUpdates(): Promise<boolean> {
  try {
    const response = await fetch(VERSION_ENDPOINT, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    });

    const serverVersion: VersionInfo = await response.json();

    if (serverVersion.version !== APP_VERSION) {
      if (serverVersion.forceUpdate) {
        forceUpdate();
        return true;
      }

      showUpdateAvailable(serverVersion);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Version check failed:', error);
    return false;
  }
}

function forceUpdate(): void {
  navigator.serviceWorker.getRegistration().then((reg) => {
    if (reg?.waiting) {
      reg.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  });

  setTimeout(() => {
    window.location.reload();
  }, 100);
}

export function startVersionChecks(): void {
  checkForUpdates();

  checkInterval = window.setInterval(checkForUpdates, VERSION_CHECK_INTERVAL);

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      checkForUpdates();
    }
  });
}

export function stopVersionChecks(): void {
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
}
```

#### 8.3 Generate version.json on Build

**File:** `scripts/generate-version.js`

```javascript
const fs = require('fs');
const { execSync } = require('child_process');

const version = execSync('git rev-parse --short HEAD').toString().trim();
const buildTime = new Date().toISOString();

const versionInfo = {
  version,
  buildTime,
  forceUpdate: process.env.FORCE_UPDATE === 'true',
};

fs.writeFileSync('docs/version.json', JSON.stringify(versionInfo, null, 2));
console.log('Generated version.json:', versionInfo);
```

**File:** `package.json`

```json
{
  "scripts": {
    "build": "vite build && node scripts/generate-version.js"
  }
}
```

#### 8.4 Handle Keycloak Redirect

Store pending update state before redirect:

**File:** `src/lib/auth/updateState.ts`

```typescript
const UPDATE_PENDING_KEY = 'nomercy_update_pending';
const UPDATE_VERSION_KEY = 'nomercy_update_version';

export function setUpdatePending(version: string): void {
  sessionStorage.setItem(UPDATE_PENDING_KEY, 'true');
  sessionStorage.setItem(UPDATE_VERSION_KEY, version);
}

export function getUpdatePending(): { pending: boolean; version: string | null } {
  return {
    pending: sessionStorage.getItem(UPDATE_PENDING_KEY) === 'true',
    version: sessionStorage.getItem(UPDATE_VERSION_KEY),
  };
}

export function clearUpdatePending(): void {
  sessionStorage.removeItem(UPDATE_PENDING_KEY);
  sessionStorage.removeItem(UPDATE_VERSION_KEY);
}

export function checkAndApplyPendingUpdate(): void {
  const { pending, version } = getUpdatePending();

  if (pending && version) {
    clearUpdatePending();

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg?.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      } else {
        window.location.reload();
      }
    });
  }
}
```

Call `checkAndApplyPendingUpdate()` after Keycloak callback.

#### 8.5 Improve Update Notification UX

**File:** `src/lib/serviceWorkerUpdates.ts`

Add auto-update after timeout if user ignores notification:

```typescript
const AUTO_UPDATE_DELAY = 30 * 60 * 1000; // 30 minutes

let autoUpdateTimeout: number | null = null;

function showUpdateNotification() {
  const updateNotification = createUpdateNotification();
  addNotification(updateNotification);

  if (autoUpdateTimeout) {
    clearTimeout(autoUpdateTimeout);
  }

  autoUpdateTimeout = window.setTimeout(() => {
    if (waitingServiceWorker) {
      console.log('Auto-applying update after timeout');
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  }, AUTO_UPDATE_DELAY);
}
```

#### 8.6 Cloudflare Headers for Cache Control

**File:** `public/_headers`

```
/version.json
  Cache-Control: no-cache, no-store, must-revalidate

/index.html
  Cache-Control: no-cache, no-store, must-revalidate

/sw.js
  Cache-Control: no-cache, no-store, must-revalidate

/assets/*
  Cache-Control: public, max-age=31536000, immutable
```

#### 8.7 Update PWA Config for Reliable Updates

**File:** `pwaConfig.ts`

```typescript
const workbox = {
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: false,

  // Add precache versioning
  additionalManifestEntries: [
    { url: '/version.json', revision: null },
  ],

  // Exclude version.json from caching
  navigateFallbackDenylist: [
    /^\/version\.json$/,
    // ... existing patterns
  ],
};
```

#### 8.8 Recovery for Users with Faulty Cache

**CRITICAL:** Users currently stuck with broken/stale caches need automatic recovery.

**Strategy 1: Cache Health Check on Load**

**File:** `src/lib/cacheHealthCheck.ts`

```typescript
const CACHE_HEALTH_KEY = 'nomercy_cache_health';
const EXPECTED_VERSION = __APP_VERSION__;

interface CacheHealth {
  version: string;
  lastCheck: number;
  healthy: boolean;
}

export async function checkCacheHealth(): Promise<boolean> {
  try {
    const response = await fetch('/version.json', { cache: 'no-store' });
    const serverVersion = await response.json();

    const stored = localStorage.getItem(CACHE_HEALTH_KEY);
    const health: CacheHealth = stored ? JSON.parse(stored) : null;

    if (!health || health.version !== serverVersion.version) {
      await clearAllCaches();
      await unregisterServiceWorkers();

      localStorage.setItem(CACHE_HEALTH_KEY, JSON.stringify({
        version: serverVersion.version,
        lastCheck: Date.now(),
        healthy: true,
      }));

      window.location.reload();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Cache health check failed:', error);
    return true;
  }
}

async function clearAllCaches(): Promise<void> {
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map((name) => caches.delete(name))
    );
    console.log('All caches cleared');
  }
}

async function unregisterServiceWorkers(): Promise<void> {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations.map((reg) => reg.unregister())
    );
    console.log('All service workers unregistered');
  }
}
```

**Strategy 2: Error Boundary Cache Recovery**

Detect chunk loading failures and recover:

**File:** `src/lib/chunkErrorRecovery.ts`

```typescript
let hasRecovered = false;

export function setupChunkErrorRecovery(): void {
  window.addEventListener('error', (event) => {
    const isChunkError =
      event.message?.includes('Loading chunk') ||
      event.message?.includes('Failed to fetch dynamically imported module') ||
      event.message?.includes('Importing a module script failed');

    if (isChunkError && !hasRecovered) {
      hasRecovered = true;
      console.error('Chunk loading failed, clearing cache and reloading...');

      clearCachesAndReload();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || String(event.reason);
    const isChunkError =
      reason.includes('Loading chunk') ||
      reason.includes('Failed to fetch dynamically imported module');

    if (isChunkError && !hasRecovered) {
      hasRecovered = true;
      console.error('Chunk loading failed (promise), clearing cache and reloading...');

      clearCachesAndReload();
    }
  });
}

async function clearCachesAndReload(): Promise<void> {
  try {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
    }

    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((reg) => reg.unregister()));
    }

    localStorage.removeItem('nomercy_cache_health');

    window.location.reload();
  } catch (error) {
    console.error('Cache clear failed:', error);
    window.location.reload();
  }
}
```

**Strategy 3: One-Time Migration for Existing Users**

For the initial deployment with this fix:

**File:** `src/lib/cacheMigration.ts`

```typescript
const MIGRATION_VERSION = 'v2';
const MIGRATION_KEY = 'nomercy_cache_migration';

export async function runCacheMigration(): Promise<void> {
  const currentMigration = localStorage.getItem(MIGRATION_KEY);

  if (currentMigration === MIGRATION_VERSION) {
    return;
  }

  console.log('Running cache migration...');

  try {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
    }

    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((reg) => reg.unregister()));
    }

    localStorage.setItem(MIGRATION_KEY, MIGRATION_VERSION);

    console.log('Cache migration complete, reloading...');
    window.location.reload();
  } catch (error) {
    console.error('Cache migration failed:', error);
    localStorage.setItem(MIGRATION_KEY, MIGRATION_VERSION);
  }
}
```

**Initialize in main.ts:**

```typescript
import { runCacheMigration } from '@/lib/cacheMigration';
import { setupChunkErrorRecovery } from '@/lib/chunkErrorRecovery';

setupChunkErrorRecovery();

runCacheMigration().then(() => {
  // Continue app initialization
});
```

---

#### 8.9 Offline Availability

Ensure critical paths work offline:

**Precache strategy:**
- App shell (index.html, main JS/CSS)
- Critical UI components
- Fallback content for offline state

**Runtime cache strategy:**
- API responses: StaleWhileRevalidate (show cached, fetch fresh)
- Images: CacheFirst with expiration
- Fonts: CacheFirst (immutable)

**Offline indicators:**

```typescript
// In App.vue or main layout
import { useOnline } from '@vueuse/core';

const isOnline = useOnline();

// Show offline banner when disconnected
```

---

### Phase 7: Code Structure & Consistency

#### 7.1 Fix Store Variable Naming

**Priority: CRITICAL**

Current stores use abbreviated internal variable names that are hard to maintain.

**Files to fix:**
- `src/store/ui.ts`
- `src/store/preferences.ts`
- `src/store/colorTheme.ts`
- `src/store/videoPlayer.ts`
- `src/store/Libraries.ts` (also rename to `libraries.ts`)

**Example fix for `ui.ts`:**

```typescript
// BEFORE
const p = ref<string | null>();
const t = ref<string | null>();
const b = ref<string | null>();
const fc = ref('var(--color-theme-8)');
const c = ref<PaletteColors | null>();

export const poster = computed(() => p.value);
export const title = computed(() => t.value);

// AFTER
const poster = ref<string | null>(null);
const title = ref<string | null>(null);
const background = ref<string | null>(null);
const focusColor = ref('var(--color-theme-8)');
const colorPalette = ref<PaletteColors | null>(null);

export const storePoster = computed(() => poster.value);
export const storeTitle = computed(() => title.value);
```

#### 7.2 Add Error Handling to Async Store Functions

**Example:**

```typescript
// BEFORE
export function setUseAutoThemeColors(value: boolean) {
  autoThemeColors.value = value;
  Preferences.set({ key: 'autoThemeColors', value: value.toString() }).then();
}

// AFTER
export async function setUseAutoThemeColors(value: boolean): Promise<void> {
  autoThemeColors.value = value;
  try {
    await Preferences.set({ key: 'autoThemeColors', value: value.toString() });
  } catch (err) {
    console.error('Failed to persist autoThemeColors:', err);
  }
}
```

#### 7.3 Standardize Component Script Structure

Ensure all components follow the standard order:
1. Imports (grouped)
2. Props
3. Emits
4. Composables
5. State (refs)
6. Computed
7. Functions
8. Lifecycle hooks
9. Watchers

#### 7.4 Remove `any` Types

Search and replace all `any` types with proper typing:

```bash
# Find all any usages
grep -r ": any" src/ --include="*.ts" --include="*.vue"
```

Common replacements:
- `any` → `unknown` (when truly unknown)
- `any[]` → `SomeType[]` (when array type is known)
- `Record<string, any>` → `Record<string, unknown>` or proper interface

#### 7.5 Standardize File Naming

Rename files that don't follow conventions:
- `src/store/Libraries.ts` → `src/store/libraries.ts`

Update all imports accordingly.

#### 7.6 Add Missing Emits Definitions

Components that use `emit()` must have `defineEmits`:

```typescript
const emit = defineEmits<{
  'update:modelValue': [value: string];
  'item-click': [item: ItemType];
}>();
```

#### 7.7 Reorganize Lib Utility Files

**Priority: MEDIUM**

The `src/lib/` folder contains utility files with mixed concerns. Reorganize for better maintainability while keeping unused functions for future use.

**Current state:**

| File | Lines | Functions | Issue |
|------|-------|-----------|-------|
| utils.ts | 1155 | 65+ | Mixed concerns - needs splitting |
| stringArray.ts | 574 | 25+ | Misleading name, mixed string/array |
| colorHelper.ts | 843 | 40+ | Good - keep as is |
| dateTime.ts | 295 | 13 | Good - keep as is |
| scrollHandlers.ts | 183 | 8 | Good - keep as is |

**Proposed reorganization:**

```
src/lib/
├── utils/
│   ├── index.ts           (barrel export)
│   ├── dom.ts             (DOM manipulation, scroll, events)
│   ├── string.ts          (string manipulation, formatting)
│   ├── array.ts           (array operations, sorting, grouping)
│   ├── format.ts          (data formatting, human-readable)
│   └── validation.ts      (type checks, validators)
├── color/
│   ├── index.ts
│   └── colorHelper.ts     (keep existing)
├── time/
│   ├── index.ts
│   └── dateTime.ts        (keep existing)
├── scroll/
│   ├── index.ts
│   └── scrollHandlers.ts  (keep existing)
├── routerHelper.ts        (keep - query utilities)
├── sliderBar.ts           (keep - slider class)
├── swiper-config.ts       (keep - swiper config)
└── uuidHelper.ts          (keep - device fingerprint)
```

**Split utils.ts into:**

`utils/dom.ts`:
```typescript
export { cn } from './cn';
export { scrollIntoView, scrollCenter, scrollTo } from './scroll';
export { stopPropagation, preventDefault, stopAndPrevent } from './events';
export { lockPortrait, lockLandscape, unlockOrientation } from './orientation';
export { enableImmersiveMode, disableImmersiveMode } from './immersive';
```

`utils/string.ts`:
```typescript
export { ucfirst, breakTitle, breakLogoTitle } from './titleUtils';
export { stringFormat, translate } from './formatting';
export { generateRandomString, hash } from './generators';
export { limitSentenceByCharacters } from './truncate';
```

`utils/array.ts`:
```typescript
export { groupBy, unique, uniqueBy, distinct } from './collection';
export { chunk, shuffle } from './manipulation';
export { sortBy, sortByType, sortByPriority } from './sorting';
```

`utils/format.ts`:
```typescript
export { formatDuration, humanFileSize } from './size';
export { mathPercentage, getRandomNumberBetween } from './numbers';
```

**Benefits:**
- Clear import paths: `import { sortBy } from '@/lib/utils/array'`
- Easier to find functions
- Unused functions stay available but organized
- Better tree-shaking potential

**Migration approach:**
1. Create new file structure
2. Move functions to appropriate files
3. Create barrel exports in index.ts files
4. Update imports across codebase
5. Keep old files temporarily with re-exports for compatibility
6. Remove old files after verifying all imports updated

---

#### 7.8 Reorganize Type Definitions

**Priority: MEDIUM**

Type definitions are scattered and contain duplicates. Reorganize by API origin and usage.

**Current issues:**

| Issue | Files Affected |
|-------|----------------|
| Duplicate `Device` interface | server.ts, api/dashboard/server.ts |
| Duplicate `ActivityLog` interface | server.ts, api/dashboard/server.ts |
| Duplicate `Profile` interface (different meanings) | person.d.ts, library.d.ts, dashboard/server.ts |
| Undefined `ColorPaletteClass` | api/base/info.d.ts (should be `PaletteColors`) |
| `Count` interface repeated | 4+ music files |
| Mixed snake_case/camelCase | Throughout |

**Proposed reorganization:**

```
src/types/
├── index.ts                    (barrel exports)
├── shared/
│   ├── index.ts
│   ├── colors.ts               (PaletteColors, ColorPalettes)
│   ├── pagination.ts           (Count, PageInfo, etc.)
│   ├── media.ts                (shared media types)
│   └── user.ts                 (Device, ActivityLog - single source)
│
├── api/
│   ├── index.ts
│   ├── responses.ts            (generic response wrappers)
│   ├── media/
│   │   ├── index.ts
│   │   ├── home.ts
│   │   ├── library.ts
│   │   ├── collection.ts
│   │   ├── info.ts
│   │   ├── person.ts
│   │   └── genre.ts
│   ├── music/
│   │   ├── index.ts
│   │   ├── artist.ts
│   │   ├── album.ts
│   │   ├── playlist.ts
│   │   ├── genre.ts
│   │   └── track.ts
│   └── dashboard/
│       ├── index.ts
│       ├── server.ts
│       ├── encoder.ts          (encoder profiles - extracted)
│       ├── ripper.ts
│       └── resources.ts
│
├── player/
│   ├── index.ts
│   ├── video.ts
│   └── music.ts
│
├── auth/
│   ├── index.ts
│   ├── user.ts
│   ├── server.ts
│   └── keycloak.ts
│
└── config/
    ├── index.ts
    └── app.ts
```

**Consolidation tasks:**

1. **Create shared/user.ts** - Single source for Device, ActivityLog:
```typescript
export interface Device {
  id: string;
  deviceId: string;
  browser: string;
  os: string;
  // ...
}

export interface ActivityLog {
  id: number;
  type: string;
  time: string;
  // ...
}
```

2. **Create shared/colors.ts** - Move from api/shared.d.ts:
```typescript
export interface PaletteColors {
  dominant?: string;
  primary?: string;
  lightVibrant?: string;
  darkVibrant?: string;
  lightMuted?: string;
  darkMuted?: string;
}

export interface ColorPalettes {
  poster?: PaletteColors;
  backdrop?: PaletteColors;
  logo?: PaletteColors;
}
```

3. **Create shared/pagination.ts** - Consolidate Count interfaces:
```typescript
export interface Count {
  tracks?: number;
  albums?: number;
  artists?: number;
}
```

4. **Fix info.d.ts** - Replace `ColorPaletteClass` with `PaletteColors`

5. **Rename Profile interfaces** for clarity:
   - `ImageProfile` (person images)
   - `EncoderProfile` (transcoding)
   - `CodecProfile` (codec settings)

**Swagger type generation (future):**

Consider generating types from swagger.json:
```bash
npx swagger-typescript-api -p https://server/swagger/v1/swagger.json -o src/types/generated -n api.ts
```

This ensures types stay in sync with the API.

---

#### 7.9 Audit and Fix User Action Feedback

**Priority: HIGH**

Audit all interactive elements to ensure immediate visual feedback:

**Files to audit:**
- All button components
- All clickable cards/items
- Form submissions
- Navigation triggers
- Toggle/switch components
- Delete/destructive actions

**Pattern to implement:**

```typescript
const isLoading = ref(false);

async function handleAction() {
  if (isLoading.value) return;

  isLoading.value = true;

  try {
    await performAction();
  } finally {
    isLoading.value = false;
  }
}
```

```vue
<button
  :disabled="isLoading"
  :class="{ 'pointer-events-none opacity-50': isLoading }"
  @click="handleAction"
>
  <LoadingSpinner v-if="isLoading" />
  <span v-else>Action</span>
</button>
```

**Common issues to fix:**
- Buttons without loading states
- Cards that navigate without active state
- Forms that allow multiple submissions
- Actions that complete silently without confirmation

---

## Code Style Guidelines

### Comments

Only add comments when they provide non-obvious information:

**DO comment:**
- Raw duration values: `max-age=31536000  # 1 year`
- Complex logic that isn't self-documenting
- Non-obvious side effects or constraints
- "Why" something is done a certain way (when not apparent)

**DO NOT comment:**
- Self-explanatory calculations: `1000 * 60 * 5` (obviously 5 minutes)
- What code does when the code already says it: `// Loop through items` before a forEach
- Obvious variable assignments or function calls
- Restating the function/variable name in prose

### Vue Component Structure

All Vue 3 components must follow this order with clear visual grouping:

```vue
<script lang="ts" setup>
// 1. Module imports (Vue first)
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { IonContent } from '@ionic/vue';

// 2. Type imports
import type { PropType } from 'vue';
import type { SomeInterface } from '@/types/api/something';

// 3. Local imports
import { someFunction } from '@/lib/helper';
import { someStore } from '@/store/something';

// 4. Component imports
import ChildComponent from '@/components/ChildComponent.vue';

// Props
const props = defineProps<{
  modelValue: string;
  disabled?: boolean;
  items?: SomeType[];
}>();

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string];
  'closed': [];
}>();

// Composables
const route = useRoute();

// State
const isOpen = ref(false);
const currentIndex = ref(0);

// Computed
const isDisabled = computed(() => props.disabled);

// Functions
function handleClick() {
}

// Lifecycle
onMounted(() => {
});

onUnmounted(() => {
});

// Watchers
watch(
  () => props.modelValue,
  (newValue) => {
  }
);
</script>

<template>
  <div>
  </div>
</template>

<style lang="scss" scoped>
</style>
```

**Formatting guidelines for readability:**
- Keep lines short (avoid long single-line statements)
- Use blank lines to separate logical groups
- Break multi-parameter function calls across lines
- Group related code together visually

### Import Organization

Five groups, separated by blank lines for clear visual separation:

```typescript
// 1. Module imports (Vue first, then other libraries alphabetically)
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { IonAvatar, IonContent } from '@ionic/vue';
import { SwiperSlide } from 'swiper/vue';

// 2. Type imports (all types grouped together)
import type { PropType } from 'vue';
import type { RouteLocationNormalized } from 'vue-router';
import type { PersonResponseItem } from '@/types/api/base/person';
import type { ColorPalettes } from '@/types/api/shared';

// 3. Local imports (lib, store, utilities)
import { pickPaletteColor } from '@/lib/colorHelper';
import { formatDate } from '@/lib/dateTime';
import { showBackdrops } from '@/store/preferences';
import { setBackground } from '@/store/ui';

// 4. Local component imports
import TMDBImage from '@/components/Images/TMDBImage.vue';
import CardIndicator from '@/components/Cards/CardIndicator.vue';
import MediaCard from '@/components/Cards/MediaCard.vue';
```

**Rationale:** Clear visual grouping aids readability for developers with dyslexia. Each group serves a distinct purpose and the blank lines create natural visual breaks.

### Store Pattern

All stores must use clear variable names and consistent structure:

```typescript
import { computed, ref } from 'vue';
import type { DataType } from '@/types/something';

// State: clear names, no abbreviations
const data = ref<DataType | null>(null);
const error = ref<string | null>(null);
const isLoading = ref(false);

// Getters: use computed
export const storeData = computed(() => data.value);
export const storeError = computed(() => error.value);
export const storeLoading = computed(() => isLoading.value);

// Setters: typed, with error handling for async
export function setData(value: DataType): void {
  data.value = value;
  error.value = null;
}

export async function fetchData(id: string): Promise<void> {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await api.getData(id);
    data.value = response;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error';
    throw err;
  } finally {
    isLoading.value = false;
  }
}

export function clearData(): void {
  data.value = null;
  error.value = null;
}
```

**Forbidden in stores:**
- Abbreviated variable names (`p`, `t`, `fc` instead of `poster`, `title`, `focusColor`)
- Using `any` type
- Unhandled promises (`.then()` without `.catch()`)
- IIFE for initialization without error handling

### TypeScript Standards

**Use `interface` for:**
- Object shapes that might be extended
- API response types
- Component props types

**Use `type` for:**
- Unions
- Primitives
- Function signatures

**Use `enum` for:**
- Fixed sets of string/number values

**Forbidden:**
- `any` type (use `unknown` or proper typing)
- Missing return types on exported functions
- Implicit `any` in parameters

```typescript
// Good
export interface HomeResponse {
  id: number;
  items: HomeItem[];
}

export type AspectRatio = 'poster' | 'backdrop';

export enum SortType {
  index = 'index',
  name = 'name',
}

// Bad
const data: any = {};
function process(value) { }  // implicit any
```

### File Naming

- **Components:** PascalCase (`MediaCard.vue`, `ImageCarousel.vue`)
- **Stores:** camelCase (`ui.ts`, `preferences.ts`, `libraries.ts`)
- **Utilities/lib:** camelCase (`colorHelper.ts`, `dateTime.ts`)
- **Types:** camelCase with `.d.ts` for declarations (`home.d.ts`, `shared.d.ts`)

### User Action Feedback

**CRITICAL:** Every user interaction must provide immediate visual feedback before any async work begins.

**Principles:**
- User clicks → instant visual response → then do work
- Never leave the user wondering if their action registered
- Prevent duplicate actions with disabled states

**Required feedback patterns:**

```typescript
// Button click with loading state
const isLoading = ref(false);

async function handleSubmit() {
  if (isLoading.value) return;

  isLoading.value = true;

  try {
    await doAsyncWork();
  } finally {
    isLoading.value = false;
  }
}
```

```vue
<template>
  <button
    :disabled="isLoading"
    :class="{ 'opacity-50': isLoading }"
    @click="handleSubmit"
  >
    <span v-if="isLoading">Loading...</span>
    <span v-else>Submit</span>
  </button>
</template>
```

**Feedback types by action:**

| Action | Immediate Feedback | During Work | On Complete |
|--------|-------------------|-------------|-------------|
| Button click | Disable + visual change | Loading indicator | Re-enable or navigate |
| Navigation | Highlight/active state | Page skeleton | Render content |
| Form submit | Disable form + spinner | Progress indicator | Success/error message |
| Toggle | Instant state change | None (optimistic) | Revert on error |
| Delete | Confirm dialog | Item fades/removes | Toast confirmation |
| Search | Input acknowledged | Skeleton results | Show results |

**Anti-patterns to avoid:**
- Clickable element with no visual response
- Async operation with no loading state
- Button that can be clicked multiple times during processing
- Navigation that shows nothing while loading
- Form that accepts multiple submissions

**Implementation checklist for interactive elements:**
- [ ] Disabled state while processing
- [ ] Visual change on click (opacity, color, icon)
- [ ] Loading indicator for operations > 300ms
- [ ] Prevent duplicate submissions
- [ ] Error state with retry option
- [ ] Success confirmation when appropriate

---

### Code Formatting for Readability

Prioritize clear, scannable code:

**Line length:**
- Keep lines reasonably short
- Break long statements across multiple lines

```typescript
// Good - easy to scan
const result = someFunction(
  firstParam,
  secondParam,
  thirdParam
);

// Avoid - hard to read
const result = someFunction(firstParam, secondParam, thirdParam, fourthParam, fifthParam);
```

**Grouping:**
- Use blank lines to create visual sections
- Group related variables together
- Group related functions together

```typescript
// Good - clear groups
const firstName = ref('');
const lastName = ref('');
const email = ref('');

const isFormValid = computed(() => {
  return firstName.value && lastName.value && email.value;
});

const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`;
});

// Avoid - no visual structure
const firstName = ref('');
const isFormValid = computed(() => firstName.value && lastName.value);
const lastName = ref('');
const fullName = computed(() => `${firstName.value} ${lastName.value}`);
const email = ref('');
```

**Object/array formatting:**
- One property per line for objects with multiple properties
- Trailing commas for easier diffs

```typescript
// Good
const config = {
  name: 'value',
  enabled: true,
  count: 5,
};

// Avoid
const config = { name: 'value', enabled: true, count: 5 };
```

---

## Technical Specifications

### Target Browser Support

```javascript
// .browserslistrc
>= 0.5%
last 2 versions
Firefox ESR
not dead
not IE 11
```

### Build Configuration

**File:** `vite.config.ts` (complete optimized config)

```typescript
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => ['swiper-slide'].includes(tag),
        },
      },
    }),
    VitePWA(pwaConfig),
    compression({ algorithm: 'gzip' }),
    compression({ algorithm: 'brotliCompress', ext: '.br' }),
  ],

  build: {
    target: 'es2020',
    outDir: 'docs',
    sourcemap: false,
    minify: 'esbuild',
    cssMinify: 'esbuild',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 250,

    rollupOptions: {
      output: {
        manualChunks: {
          'vue-core': ['vue', 'vue-router'],
          'ionic': ['@ionic/vue', '@ionic/vue-router', '@ionic/core'],
          'primevue': ['primevue', '@primevue/themes'],
          'swiper': ['swiper'],
          'query': ['@tanstack/vue-query'],
          'i18n': ['i18next', 'i18next-vue'],
          'signalr': ['@microsoft/signalr'],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },

  optimizeDeps: {
    include: ['vue', '@ionic/vue', 'vue-router', 'axios'],
    exclude: ['subtitles-octopus'],
  },
});
```

### Performance Budget

```javascript
// performance-budget.json
{
  "bundles": [
    {
      "name": "main",
      "maxSize": "150kb"
    },
    {
      "name": "vendor",
      "maxSize": "300kb"
    }
  ],
  "assets": [
    {
      "type": "js",
      "maxSize": "500kb"
    },
    {
      "type": "css",
      "maxSize": "50kb"
    },
    {
      "type": "image",
      "maxSize": "200kb"
    }
  ],
  "timing": {
    "fcp": 1500,
    "lcp": 2500,
    "tti": 3500,
    "tbt": 300
  }
}
```

---

## File Reference Guide

### Core Files to Modify

| File | Priority | Changes |
|------|----------|---------|
| `vite.config.ts` | Critical | Add manual chunks, compression |
| `src/setupApp.ts` | Critical | Fix Swiper duplication, remove NM component global registrations |
| `src/router/routes.ts` | Critical | Fix layout lazy loading |
| `src/main.ts` | High | Optimize initialization order |
| `src/components/Images/TMDBImage.vue` | High | Add responsive loading, keep color palette gradients |
| `src/lib/routerHelper.ts` | Medium | Remove structuredClone |
| `src/config/tanstack-query.ts` | Medium | Optimize query defaults |
| `index.html` | Medium | Add preconnect hints |
| `src/Layout/Desktop/components/ScrollContainer.vue` | Low | Optimize afterEach |

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/async.ts` | Async component definitions |
| `src/components/Loading/VideoPlayerSkeleton.vue` | Loading placeholder |
| `src/components/Loading/MusicPlayerSkeleton.vue` | Loading placeholder |
| `performance-budget.json` | Performance budget config |

### NM Components - Convert to Local Component Map

**Remove global registration** for these components and use a local component map with lazy loading in `NMComponent.vue` (see Phase 2.1).

Vue's `:is` binding accepts component objects directly, so API string names can be mapped to lazy-loaded components.

**Components to convert to lazy-loaded local map:**
1. `src/components/NMCard.vue`
2. `src/components/NMCarousel.vue`
3. `src/components/NMCarousel2.vue`
4. `src/components/NMContainer.vue`
5. `src/components/NMGenreCard.vue`
6. `src/components/NMGrid.vue`
7. `src/components/NMHomeCard.vue`
8. `src/components/NMList.vue`
9. `src/components/NMSeasonCard.vue`
10. `src/components/NMSeasonTitle.vue`
11. `src/components/NMMusicCard.vue`
12. `src/components/NMMusicHomeCard.vue`
13. `src/components/NMServerComponent.vue`
14. `src/components/NMTopResultCard.vue`
15. `src/components/NMTrackRow.vue`

**Other components to make local:**
- PrimeVue components (Card, Dialog, InputNumber, etc.)
- Utility components

---

## Testing & Validation

### CRITICAL: Test Every Change

**Every individual task must be fully tested before moving to the next.**

**Mandatory testing protocol for EACH change:**

1. **Build verification:**
   ```bash
   yarn build
   ```
   Must complete without errors or warnings.

2. **Type checking:**
   ```bash
   yarn typecheck  # if configured
   ```
   Must pass with no errors.

3. **Lint checking:**
   ```bash
   yarn lint
   ```
   Must pass with no errors.

4. **Manual smoke test:**
   - Start dev server: `yarn dev`
   - Complete Keycloak login
   - Navigate to home page
   - Check browser console for errors
   - Test the specific feature changed
   - Test related features for regressions

5. **Regression checklist:**
   - [ ] App loads without errors
   - [ ] Authentication works
   - [ ] Home page renders
   - [ ] Navigation works
   - [ ] Images load
   - [ ] Carousels function
   - [ ] No console errors
   - [ ] No TypeScript errors
   - [ ] Feature being changed works correctly
   - [ ] Related features still work

**DO NOT proceed to next task until all checks pass.**

If a regression is found:
1. Stop immediately
2. Revert the change
3. Investigate the cause
4. Fix and re-test from scratch

---

### Authentication Handling for Testing

**IMPORTANT:** The app uses Keycloak OAuth and blocks full loading without a valid session.

#### Option 1: Use Existing Session (Recommended for Development)

1. **Login via browser first:**
   ```
   https://app-dev.nomercy.tv
   ```
   Complete Keycloak login flow in your browser.

2. **Token is stored locally at:**
   ```
   C:\Users\patri\AppData\Local\NoMercy_dev\config\token.json
   ```

3. **Verify token validity:**
   ```powershell
   $token = (Get-Content "C:\Users\patri\AppData\Local\NoMercy_dev\config\token.json" | ConvertFrom-Json)
   $expiry = [DateTimeOffset]::FromUnixTimeSeconds($token.exp ?? 0)
   Write-Host "Token expires: $expiry"
   ```

#### Option 2: Development Auth Bypass (For CI/Testing)

Create a development-only auth bypass that can be enabled via environment variable:

**File:** `src/config/auth.ts` (create if needed)

```typescript
export const DEV_AUTH_BYPASS = import.meta.env.VITE_DEV_AUTH_BYPASS === 'true';

export function shouldBypassAuth(): boolean {
  return DEV_AUTH_BYPASS && import.meta.env.DEV;
}

export const DEV_MOCK_USER = {
  id: 'dev-user',
  name: 'Development User',
  email: 'dev@nomercy.tv',
};
```

**Usage in auth initialization:**
```typescript
if (shouldBypassAuth()) {
  console.warn('[DEV] Auth bypass enabled');
  return;
}
```

**Start dev server with bypass:**
```bash
VITE_DEV_AUTH_BYPASS=true yarn dev
```

#### Option 3: Pre-authenticated Test Environment

For automated testing, use a dedicated test server with pre-configured sessions:

```bash
# .env.test
VITE_API_URL=https://test-api.nomercy.tv
VITE_AUTH_DISABLED=true
```

### Per-Phase Testing Protocol

**CRITICAL:** Every change must be tested with these steps:

#### Pre-Change Baseline
```bash
yarn build
yarn preview
```
Open in browser with DevTools - record Performance, note Network transfer size, check Console for errors.

#### Post-Change Verification
```bash
yarn build
yarn dev
```

Test checklist:
- Authentication: Keycloak redirect works, app loads after login
- Critical paths: Home, /libraries, movie/TV info pages, search, music
- NM components: Carousels display, API-driven components render
- Images: Color palette gradients show immediately, images lazy-load

### Performance Testing Tools

1. **Lighthouse CLI**
   ```bash
   npx lighthouse https://app-dev.nomercy.tv --output=html --view
   ```

2. **WebPageTest**
   ```
   https://www.webpagetest.org/
   ```

3. **Bundle Analyzer**
   ```bash
   yarn analyze
   ```

4. **Chrome DevTools Performance Panel**
   - Record page load
   - Analyze main thread activity
   - Check for long tasks

### Validation Checklist

- [ ] Initial bundle < 150KB gzipped
- [ ] FCP < 1.5s on 3G
- [ ] LCP < 2.5s on 3G
- [ ] TTI < 3.5s on 3G
- [ ] CLS < 0.1
- [ ] No render-blocking resources
- [ ] All images lazy-loaded
- [ ] Service worker functioning
- [ ] No console errors
- [ ] All routes load correctly
- [ ] **Keycloak auth flow works**
- [ ] **NM components render from API data (via local component map)**
- [ ] **Color palette gradients display correctly**
- [ ] **App updates automatically without manual cache clear**
- [ ] **Update notification appears when new version deployed**
- [ ] **Offline mode shows appropriate indicators**

### Regression Testing

After each phase:
1. Run full Lighthouse audit
2. Compare bundle sizes
3. Test on slow 3G throttling
4. Verify all features work
5. Check for visual regressions
6. **Verify auth flow still works**
7. **Verify dynamic component rendering**

---

## Success Metrics

### Phase 1 Completion Criteria
- Main bundle reduced by 50%+
- No duplicate Swiper code
- Layouts lazy-loaded correctly

**Phase 1 Testing Requirements:**
- [ ] `yarn build` completes without errors
- [ ] Bundle sizes decreased (compare before/after)
- [ ] App loads on desktop (correct layout)
- [ ] App loads on mobile (correct layout)
- [ ] Swiper carousels function correctly
- [ ] Navigation between routes works
- [ ] No console errors on load
- [ ] Keycloak auth flow completes successfully

### Phase 2 Completion Criteria
- NM components converted to local component map with lazy loading
- Global registrations removed from `setupApp.ts`
- Non-API components (PrimeVue, utilities) made local
- Heavy components use defineAsyncComponent
- Swiper imported locally in components that use it

**Phase 2 Testing Requirements:**
- [ ] `yarn build` completes without errors
- [ ] Home page loads with all carousels rendered
- [ ] Each NM component type renders correctly:
  - [ ] NMCarousel / NMCarousel2
  - [ ] NMCard
  - [ ] NMGrid
  - [ ] NMList
  - [ ] NMHomeCard
  - [ ] NMMusicCard
  - [ ] NMTrackRow
  - [ ] NMGenreCard
  - [ ] NMSeasonCard
  - [ ] NMServerComponent
- [ ] API-driven dynamic components render from API response
- [ ] Lazy-loaded components show loading state briefly
- [ ] No "component not found" warnings in console
- [ ] Navigation to all major routes works
- [ ] Video player loads when needed
- [ ] Music player loads when needed

### Phase 3 Completion Criteria
- Images load with WebP format
- Color palette gradient placeholders preserved
- Device pixel ratio-aware sizing implemented
- Native lazy loading maintained (Intersection Observer optional)

**Phase 3 Testing Requirements:**
- [ ] `yarn build` completes without errors
- [ ] Images show gradient placeholder before loading
- [ ] Gradient colors match image dominant colors
- [ ] Images load in WebP format (check Network tab)
- [ ] Fallback to JPEG/PNG works in Safari < 14
- [ ] Images on 1x displays load 1x resolution
- [ ] Images on 2x displays load 2x resolution
- [ ] Off-screen images don't load until scrolled into view
- [ ] No broken image placeholders
- [ ] Image loading doesn't cause layout shift (CLS)

### Phase 4 Completion Criteria
- No structuredClone in hot paths
- Request deduplication working
- Query cache optimized

**Phase 4 Testing Requirements:**
- [ ] `yarn build` completes without errors
- [ ] Home page data loads correctly
- [ ] Mutations update UI without full refetch
- [ ] Duplicate rapid requests are deduplicated (check Network tab)
- [ ] Cached data displays while fetching fresh data
- [ ] Going offline shows cached content
- [ ] Coming back online fetches fresh data
- [ ] No "Cannot read property of undefined" errors
- [ ] Memory usage stable during extended use (check DevTools Memory)

### Phase 5 Completion Criteria
- Virtual scrolling for lists > 20 items
- ScrollContainer optimized
- ShallowRef for large objects

**Phase 5 Testing Requirements:**
- [ ] `yarn build` completes without errors
- [ ] Long carousels scroll smoothly (no jank)
- [ ] Virtual scrolling renders only visible items (check DOM)
- [ ] Scroll position resets on navigation
- [ ] Scroll position preserved on back navigation
- [ ] No excessive re-renders (check React DevTools equivalent)
- [ ] Large library pages load without freezing
- [ ] Memory usage doesn't grow on repeated navigation

### Phase 6 Completion Criteria
- Gzip and Brotli compression enabled
- Optimal caching headers
- Performance budget enforced

**Phase 6 Testing Requirements:**
- [ ] `yarn build` completes without errors
- [ ] .gz and .br files generated in build output
- [ ] Server serves compressed files (check Content-Encoding header)
- [ ] Cache headers correct for each file type:
  - [ ] index.html: no-cache
  - [ ] /assets/*: immutable, 1 year
  - [ ] /fonts/*: immutable, 1 year
  - [ ] sw.js: no-cache
- [ ] Lighthouse performance score improved
- [ ] Second page load significantly faster (cached assets)

### Phase 8 Completion Criteria
- version.json generated on every build
- App checks for updates on load and periodically
- Update notification shown with "Update Now" / "Later" options
- Auto-update after 30 minutes if user ignores notification
- Force update capability for critical fixes
- Update state persisted through Keycloak redirect
- User NEVER needs to manually clear cache
- Chunk loading errors trigger automatic cache clear and reload
- One-time migration clears stale caches for existing users
- Offline indicator shown when disconnected
- Critical app shell works offline

**Phase 8 Testing Requirements:**

*Version Check:*
- [ ] version.json exists in build output
- [ ] version.json contains correct git hash
- [ ] App fetches version.json on load (check Network tab)
- [ ] Version check repeats every 5 minutes

*Update Notification:*
- [ ] Deploy new version to Cloudflare
- [ ] Existing open tab shows update notification
- [ ] "Update Now" button reloads with new version
- [ ] "Later" button dismisses notification
- [ ] After 30 minutes, auto-update triggers

*Keycloak Redirect:*
- [ ] Trigger update, then navigate to trigger Keycloak redirect
- [ ] After redirect, update is applied automatically
- [ ] No stale content after Keycloak flow

*Cache Recovery:*
- [ ] Simulate stale cache (modify cached JS file hash)
- [ ] App detects chunk load failure
- [ ] Caches are cleared automatically
- [ ] App reloads with fresh content
- [ ] No user intervention required

*One-Time Migration:*
- [ ] Clear localStorage migration key
- [ ] Load app - migration runs
- [ ] All caches cleared
- [ ] App reloads once
- [ ] Subsequent loads don't trigger migration

*Offline Mode:*
- [ ] Load app while online
- [ ] Go offline (DevTools Network tab)
- [ ] Offline indicator appears
- [ ] Cached pages still accessible
- [ ] Go online - indicator disappears
- [ ] Fresh data fetches automatically

*Force Update:*
- [ ] Set forceUpdate: true in version.json
- [ ] Deploy to Cloudflare
- [ ] App immediately reloads without prompt

### Phase 7 Completion Criteria
- All store variables use clear, descriptive names
- All async functions have proper error handling
- All components follow standard script structure order
- No `any` types in codebase
- All file names follow naming conventions
- All components with emit() have defineEmits
- `utils.ts` split into focused utility modules
- Type definitions reorganized by API origin
- Duplicate types consolidated to single source
- All interactive elements provide immediate visual feedback
- No buttons/actions without loading states for async operations

**Phase 7 Testing Requirements:**

*Store Refactoring (7.1-7.2):*
- [ ] `yarn build` completes without errors
- [ ] TypeScript compilation has no errors
- [ ] All store imports resolve correctly
- [ ] UI state persists correctly (theme, preferences)
- [ ] Color palette updates work
- [ ] Sort order changes work

*Component Structure (7.3):*
- [ ] ESLint passes with no errors
- [ ] Components render without warnings
- [ ] Props passed correctly
- [ ] Events emitted correctly

*Type Cleanup (7.4, 7.8):*
- [ ] `yarn typecheck` passes (if configured)
- [ ] No `any` types in `git diff`
- [ ] IDE shows no type errors
- [ ] API responses typed correctly

*File Naming (7.5):*
- [ ] All imports resolve after renames
- [ ] No broken import paths
- [ ] IDE find-references works

*Emits (7.6):*
- [ ] All component events work
- [ ] Parent components receive events
- [ ] No "event not defined" warnings

*Utils Reorganization (7.7):*
- [ ] All utility imports resolve
- [ ] Functions work as before
- [ ] No duplicate function definitions
- [ ] Tree-shaking works (unused utils not in bundle)

*User Action Feedback (7.9):*
- [ ] Every button shows loading state when clicked
- [ ] Buttons disabled during async operations
- [ ] No double-submissions possible
- [ ] Navigation shows active/loading state
- [ ] Forms disable during submission
- [ ] Delete actions show confirmation
- [ ] Success/error feedback shown

---

## Appendix: Quick Reference Commands

```bash
yarn dev
yarn build
yarn preview
yarn analyze

npx lighthouse https://app-dev.nomercy.tv --output=html

$token = (Get-Content "C:\Users\patri\AppData\Local\NoMercy_dev\config\token.json" | ConvertFrom-Json).access_token
curl -H "Authorization: Bearer $token" "https://api-endpoint/test"
```

---

**Document maintained by:** Claude Code
**Last updated:** 2025-02-05
