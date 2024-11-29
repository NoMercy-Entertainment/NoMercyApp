// vite.config.ts
import path from "path";
import { defineConfig } from "file:///C:/Projects/NoMercy/NoMercy.App/node_modules/vite/dist/node/index.js";
import { VitePWA } from "file:///C:/Projects/NoMercy/NoMercy.App/node_modules/vite-plugin-pwa/dist/index.js";
import { ViteCspPlugin } from "file:///C:/Projects/NoMercy/NoMercy.App/node_modules/vite-plugin-csp/dist/index.js";
import { ViteMinifyPlugin } from "file:///C:/Projects/NoMercy/NoMercy.App/node_modules/vite-plugin-minify/dist/index.cjs";
import vue from "file:///C:/Projects/NoMercy/NoMercy.App/node_modules/@vitejs/plugin-vue/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Projects\\NoMercy\\NoMercy.App";
var vite_config_default = defineConfig({
  plugins: [
    vue({}),
    // legacy({
    // 	targets: ['chrome 100', 'firefox 100', 'safari 14', 'edge 100', 'not IE 11'],
    // 	additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
    // 	modernTargets: ['chrome 100', 'firefox 100', 'safari 14', 'edge 100'],
    // }),
    VitePWA({
      registerType: "autoUpdate",
      selfDestroying: true,
      workbox: {
        cleanupOutdatedCaches: true,
        sourcemap: true,
        skipWaiting: true,
        maximumFileSizeToCacheInBytes: 3e7
      },
      manifest: {
        name: "NoMercy TV",
        short_name: "NoMercy TV",
        description: "Encode and archive all your movies and tv show's, and play them on all your devices.",
        categories: [
          "video",
          "encoder",
          "player",
          "library",
          "nomercy",
          "server"
        ],
        theme_color: "#000000",
        background_color: "#000000",
        // display_override: ['standalone', 'minimal-ui'],
        display: "standalone",
        orientation: "any",
        scope: "/",
        start_url: "/",
        display_override: [
          "standalone",
          "window-controls-overlay",
          "fullscreen"
        ],
        iarc_rating_id: "6",
        id: "tv.nomercy.app",
        protocol_handlers: [
          {
            protocol: "web+nomercy",
            url: "/%s"
          }
        ],
        prefer_related_applications: true,
        icons: [
          {
            src: "/img/icons/android-chrome-512x512.png",
            sizes: "512x512",
            purpose: "maskable"
          },
          {
            src: "/img/icons/android-chrome-512x512.png",
            sizes: "512x512",
            purpose: "any"
          },
          {
            src: "/img/icons/android-chrome-384x384.png",
            sizes: "384x384",
            purpose: "any"
          },
          {
            src: "/img/icons/android-chrome-256x256.png",
            sizes: "256x256",
            purpose: "any"
          },
          {
            src: "/img/icons/android-chrome-192x192.png",
            sizes: "192x192",
            purpose: "any"
          },
          {
            src: "/img/icons/android-chrome-144x144.png",
            sizes: "144x144",
            purpose: "any"
          },
          {
            src: "/img/icons/android-chrome-96x96.png",
            sizes: "96x96",
            purpose: "any"
          },
          {
            src: "/img/icons/android-chrome-72x72.png",
            sizes: "72x72",
            purpose: "any"
          },
          {
            src: "/img/icons/android-chrome-48x48.png",
            sizes: "48x48",
            purpose: "any"
          },
          {
            src: "/img/icons/android-chrome-36x36.png",
            sizes: "36x36",
            purpose: "any"
          }
        ],
        screenshots: [],
        shortcuts: [
          {
            name: "Home",
            short_name: "Home",
            url: "/",
            icons: [
              {
                src: "/img/icons/android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "any"
              }
            ]
          }
        ]
      }
    }),
    ViteCspPlugin({
      "base-uri": [
        "self"
      ],
      "object-src": [
        "self",
        "blob:"
      ],
      "script-src": [
        "self",
        "unsafe-eval",
        "unsafe-hashes",
        "https://www.youtube.com",
        "https://nomercy.tv",
        "https://*.nomercy.tv",
        "https://vscode.nomercy.tv",
        "https://trailer.nomercy.tv",
        "https://*.nomercy.tv:*",
        "https://ssl.p.jwpcdn.com/player/v/8.28.1/jwplayer.js",
        // 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js',
        // 'https://www.gstatic.com/cast/sdk/libs/sender/1.0/cast_framework.js',
        "https://cdn.jsdelivr.net/npm/webvtt-parser@2.2.0/parser.min.js",
        "https://ssl.p.jwpcdn.com",
        "https://vjs.zencdn.net",
        "https://cdn.jsdelivr.net",
        // 'https://content.jwplatform.com',
        // 'https://www.gstatic.com',
        // 'https://unpkg.com/codepage@1.15.0/cptable.js',
        // 'https://unpkg.com/codepage@1.15.0/cputils.js',
        // 'https://storage.nomercy.tv/laravel/player/js/opentype.min.js',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/util.min.js',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/text-server.min.js',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/subtitle-tags.min.js',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/subtitle-parser.min.js',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/subtitle-event.min.js',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/style.min.js',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/style-override.min.js',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/sabre.min.js',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/shader.min.js',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/scheduler.min.js',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/renderer-main.min.js',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/global-constants.min.js',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/canvas-2d-shape-renderer.min.js',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/canvas-2d-text-renderer.min.js',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/color.min.js',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/font-server.min.js',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/lib/BSpline.min.js',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/lib/earcut.min.js',
        "sha256-G3Q1p4s6LacltrOf4BnWiwdl1rEp+mmS6DwpXr5fjKg=",
        "sha256-VA8O2hAdooB288EpSTrGLl7z3QikbWU9wwoebO/QaYk=",
        "sha256-+5XkZFazzJo8n0iOP4ti/cLCMUudTf//Mzkb7xNPXIc=",
        "sha256-MS6/3FCg4WjP9gwgaBGwLpRCY6fZBgwmhVCdrPrNf3E=",
        "sha256-tQjf8gvb2ROOMapIxFvFAYBeUJ0v1HCbOcSmDNXGtDo=",
        "sha256-+5XkZFazzJo8n0iOP4ti/cLCMUudTf//Mzkb7xNPXIc=",
        "sha256-XC/gbdknUrCiLbZdZ8y96M9KVODooJYGbxrY7P+a1Rg=",
        "https://static.cloudflareinsights.com"
      ],
      "style-src": [
        "self",
        "unsafe-inline",
        "unsafe-eval",
        "https://cdn.nomercy.tv",
        "https://cdn-dev.nomercy.tv",
        "https://storage.nomercy.tv"
      ],
      "img-src": [
        "self",
        "blob:",
        "data:",
        "https://nomercy.tv",
        "https://*.nomercy.tv:*",
        "https://*.nomercy.tv",
        "https://*.spotify.com/*",
        "https://*.archive.org",
        "https://archive.org",
        "https://coverartarchive.org",
        "https://i.ytimg.com",
        "https://image.tmdb.org",
        "https://lastfm.freetls.fastly.net",
        "https://images.fanart.tv",
        "https://assets.fanart.tv",
        "wss://*.nomercy.tv:*"
      ],
      "connect-src": [
        "self",
        "blob:",
        "data:",
        "https://nomercy.tv",
        "https://*.nomercy.tv:*",
        "https://*.nomercy.tv",
        "https://*.spotify.com/*",
        "https://image.tmdb.org",
        "https://www.last.fm",
        "ws://*.nomercy.tv:*",
        "ws://192.168.2.201:*",
        "wss://*.nomercy.tv:*",
        "wss://127.0.0.1:*",
        "wss://localhost:*"
        //
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/shaders/cache.fragment.glsl',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/shaders/cache.vertex.glsl',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/shaders/clip.fragment.glsl',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/shaders/clip.vertex.glsl',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/shaders/edge_blur.fragment.glsl',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/shaders/effect.vertex.glsl',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/shaders/gauss_blur.1.fragment.glsl',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/shaders/gauss_blur.2.fragment.glsl',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/shaders/positioning.fragment.glsl',
        // 'https://unpkg.com/@sabre-js/sabre@0.5.1-pre.8bd763/dist/shaders/positioning.vertex.glsl',
      ],
      "frame-src": [
        "self",
        "https://nomercy.tv",
        "https://*.nomercy.tv:*",
        "https://auth-dev.nomercy.tv",
        "https://auth-dev.nomercy.tv/*",
        "https://www.youtube.com"
      ],
      "font-src": [
        "self",
        "blob:",
        "data:",
        "https://cdn.nomercy.tv",
        "https://cdn-dev.nomercy.tv"
      ],
      "media-src": [
        "self",
        "blob:",
        "data:",
        "https://nomercy.tv",
        "https://*.nomercy.tv",
        "https://*.nomercy.tv:*",
        "wss://*.nomercy.tv:*"
      ],
      "worker-src": [
        "self",
        "blob:"
      ]
    }, {
      enabled: true,
      hashingMethod: "sha256",
      hashEnabled: {
        "script-src": true,
        "style-src": false,
        "script-src-attr": false,
        "style-src-attr": false
      },
      nonceEnabled: {
        "script-src": false,
        "style-src": false
      },
      processFn: "Nginx"
    }),
    ViteMinifyPlugin()
    // gzipPlugin(),
  ],
  server: {
    port: 5501,
    host: true
  },
  preview: {
    port: 5501,
    host: true
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 102400,
    emptyOutDir: true,
    minify: "esbuild",
    rollupOptions: {
      preserveEntrySignatures: "exports-only",
      treeshake: "recommended",
      output: {
        sourcemap: true,
        compact: true,
        esModule: true,
        minifyInternalExports: true,
        sanitizeFileName: true,
        manualChunks: {
          // MediaSession: ['/resources/ts/lib/MediaSession.ts'],
          // SocketClient: ['/resources/ts/lib/clients/SocketClient/index.ts'],
          // stringArray: ['/resources/ts/lib/stringArray.ts'],
          // uuidHelper: ['/resources/ts/lib/uuidHelper.ts'],
          // colorHelper: ['/resources/ts/lib/colorHelper.ts'],
          // musicPlayer: ['/resources/ts/lib/MusicPlayer/index.ts'],
        }
      }
    }
  },
  optimizeDeps: {
    exclude: [],
    force: true,
    esbuildOptions: {
      minify: true,
      // Minify the code
      minifySyntax: true,
      minifyIdentifiers: true,
      minifyWhitespace: true,
      treeShaking: true,
      // dead code elimination
      // splitting: true, // create chunks
      format: "esm",
      sourcemap: true,
      dropLabels: ["DEV"],
      plugins: [],
      target: "es2020"
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "@Icons": path.resolve(__vite_injected_original_dirname, "./resources/icons")
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxQcm9qZWN0c1xcXFxOb01lcmN5XFxcXE5vTWVyY3kuQXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxQcm9qZWN0c1xcXFxOb01lcmN5XFxcXE5vTWVyY3kuQXBwXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Qcm9qZWN0cy9Ob01lcmN5L05vTWVyY3kuQXBwL3ZpdGUuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmltcG9ydCB7ZGVmaW5lQ29uZmlnfSBmcm9tICd2aXRlJztcbmltcG9ydCB7Vml0ZVBXQX0gZnJvbSAndml0ZS1wbHVnaW4tcHdhJztcbmltcG9ydCB7Vml0ZUNzcFBsdWdpbn0gZnJvbSAndml0ZS1wbHVnaW4tY3NwJztcbi8vIGltcG9ydCBsZWdhY3kgZnJvbSAnQHZpdGVqcy9wbHVnaW4tbGVnYWN5JztcbmltcG9ydCB7IFZpdGVNaW5pZnlQbHVnaW4gfSBmcm9tICd2aXRlLXBsdWdpbi1taW5pZnknXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdub2RlOmZzJztcbmltcG9ydCBnemlwUGx1Z2luIGZyb20gXCJyb2xsdXAtcGx1Z2luLWd6aXBcIjtcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcblx0cGx1Z2luczogW1xuXHRcdHZ1ZSh7XG5cdFx0fSksXG5cdFx0Ly8gbGVnYWN5KHtcblx0XHQvLyBcdHRhcmdldHM6IFsnY2hyb21lIDEwMCcsICdmaXJlZm94IDEwMCcsICdzYWZhcmkgMTQnLCAnZWRnZSAxMDAnLCAnbm90IElFIDExJ10sXG5cdFx0Ly8gXHRhZGRpdGlvbmFsTGVnYWN5UG9seWZpbGxzOiBbJ3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZSddLFxuXHRcdC8vIFx0bW9kZXJuVGFyZ2V0czogWydjaHJvbWUgMTAwJywgJ2ZpcmVmb3ggMTAwJywgJ3NhZmFyaSAxNCcsICdlZGdlIDEwMCddLFxuXHRcdC8vIH0pLFxuXHRcdFZpdGVQV0Eoe1xuXHRcdFx0cmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXG5cdFx0XHRzZWxmRGVzdHJveWluZzogdHJ1ZSxcblx0XHRcdHdvcmtib3g6IHtcblx0XHRcdFx0Y2xlYW51cE91dGRhdGVkQ2FjaGVzOiB0cnVlLFxuXHRcdFx0XHRzb3VyY2VtYXA6IHRydWUsXG5cdFx0XHRcdHNraXBXYWl0aW5nOiB0cnVlLFxuXHRcdFx0XHRtYXhpbXVtRmlsZVNpemVUb0NhY2hlSW5CeXRlczogMzAwMDAwMDBcblx0XHRcdH0sXG5cdFx0XHRtYW5pZmVzdDoge1xuXHRcdFx0XHRuYW1lOiAnTm9NZXJjeSBUVicsXG5cdFx0XHRcdHNob3J0X25hbWU6ICdOb01lcmN5IFRWJyxcblx0XHRcdFx0ZGVzY3JpcHRpb246XG5cdFx0XHRcdFx0J0VuY29kZSBhbmQgYXJjaGl2ZSBhbGwgeW91ciBtb3ZpZXMgYW5kIHR2IHNob3dcXCdzLCBhbmQgcGxheSB0aGVtIG9uIGFsbCB5b3VyIGRldmljZXMuJyxcblx0XHRcdFx0Y2F0ZWdvcmllczogW1xuXHRcdFx0XHRcdCd2aWRlbycsXG5cdFx0XHRcdFx0J2VuY29kZXInLFxuXHRcdFx0XHRcdCdwbGF5ZXInLFxuXHRcdFx0XHRcdCdsaWJyYXJ5Jyxcblx0XHRcdFx0XHQnbm9tZXJjeScsXG5cdFx0XHRcdFx0J3NlcnZlcicsXG5cdFx0XHRcdF0sXG5cdFx0XHRcdHRoZW1lX2NvbG9yOiAnIzAwMDAwMCcsXG5cdFx0XHRcdGJhY2tncm91bmRfY29sb3I6ICcjMDAwMDAwJyxcblx0XHRcdFx0Ly8gZGlzcGxheV9vdmVycmlkZTogWydzdGFuZGFsb25lJywgJ21pbmltYWwtdWknXSxcblx0XHRcdFx0ZGlzcGxheTogJ3N0YW5kYWxvbmUnLFxuXHRcdFx0XHRvcmllbnRhdGlvbjogJ2FueScsXG5cdFx0XHRcdHNjb3BlOiAnLycsXG5cdFx0XHRcdHN0YXJ0X3VybDogJy8nLFxuXHRcdFx0XHRkaXNwbGF5X292ZXJyaWRlOiBbXG5cdFx0XHRcdFx0J3N0YW5kYWxvbmUnLFxuXHRcdFx0XHRcdCd3aW5kb3ctY29udHJvbHMtb3ZlcmxheScsXG5cdFx0XHRcdFx0J2Z1bGxzY3JlZW4nXG5cdFx0XHRcdF0sXG5cdFx0XHRcdGlhcmNfcmF0aW5nX2lkOiAnNicsXG5cdFx0XHRcdGlkOiAndHYubm9tZXJjeS5hcHAnLFxuXHRcdFx0XHRwcm90b2NvbF9oYW5kbGVyczogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHByb3RvY29sOiAnd2ViK25vbWVyY3knLFxuXHRcdFx0XHRcdFx0dXJsOiAnLyVzJyxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRdLFxuXHRcdFx0XHRwcmVmZXJfcmVsYXRlZF9hcHBsaWNhdGlvbnM6IHRydWUsXG5cdFx0XHRcdGljb25zOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0c3JjOiAnL2ltZy9pY29ucy9hbmRyb2lkLWNocm9tZS01MTJ4NTEyLnBuZycsXG5cdFx0XHRcdFx0XHRzaXplczogJzUxMng1MTInLFxuXHRcdFx0XHRcdFx0cHVycG9zZTogJ21hc2thYmxlJyxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHNyYzogJy9pbWcvaWNvbnMvYW5kcm9pZC1jaHJvbWUtNTEyeDUxMi5wbmcnLFxuXHRcdFx0XHRcdFx0c2l6ZXM6ICc1MTJ4NTEyJyxcblx0XHRcdFx0XHRcdHB1cnBvc2U6ICdhbnknLFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0c3JjOiAnL2ltZy9pY29ucy9hbmRyb2lkLWNocm9tZS0zODR4Mzg0LnBuZycsXG5cdFx0XHRcdFx0XHRzaXplczogJzM4NHgzODQnLFxuXHRcdFx0XHRcdFx0cHVycG9zZTogJ2FueScsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRzcmM6ICcvaW1nL2ljb25zL2FuZHJvaWQtY2hyb21lLTI1NngyNTYucG5nJyxcblx0XHRcdFx0XHRcdHNpemVzOiAnMjU2eDI1NicsXG5cdFx0XHRcdFx0XHRwdXJwb3NlOiAnYW55Jyxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHNyYzogJy9pbWcvaWNvbnMvYW5kcm9pZC1jaHJvbWUtMTkyeDE5Mi5wbmcnLFxuXHRcdFx0XHRcdFx0c2l6ZXM6ICcxOTJ4MTkyJyxcblx0XHRcdFx0XHRcdHB1cnBvc2U6ICdhbnknLFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0c3JjOiAnL2ltZy9pY29ucy9hbmRyb2lkLWNocm9tZS0xNDR4MTQ0LnBuZycsXG5cdFx0XHRcdFx0XHRzaXplczogJzE0NHgxNDQnLFxuXHRcdFx0XHRcdFx0cHVycG9zZTogJ2FueScsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRzcmM6ICcvaW1nL2ljb25zL2FuZHJvaWQtY2hyb21lLTk2eDk2LnBuZycsXG5cdFx0XHRcdFx0XHRzaXplczogJzk2eDk2Jyxcblx0XHRcdFx0XHRcdHB1cnBvc2U6ICdhbnknLFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0c3JjOiAnL2ltZy9pY29ucy9hbmRyb2lkLWNocm9tZS03Mng3Mi5wbmcnLFxuXHRcdFx0XHRcdFx0c2l6ZXM6ICc3Mng3MicsXG5cdFx0XHRcdFx0XHRwdXJwb3NlOiAnYW55Jyxcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHNyYzogJy9pbWcvaWNvbnMvYW5kcm9pZC1jaHJvbWUtNDh4NDgucG5nJyxcblx0XHRcdFx0XHRcdHNpemVzOiAnNDh4NDgnLFxuXHRcdFx0XHRcdFx0cHVycG9zZTogJ2FueScsXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRzcmM6ICcvaW1nL2ljb25zL2FuZHJvaWQtY2hyb21lLTM2eDM2LnBuZycsXG5cdFx0XHRcdFx0XHRzaXplczogJzM2eDM2Jyxcblx0XHRcdFx0XHRcdHB1cnBvc2U6ICdhbnknLFxuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdF0sXG5cdFx0XHRcdHNjcmVlbnNob3RzOiBbXSxcblx0XHRcdFx0c2hvcnRjdXRzOiBbXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0bmFtZTogJ0hvbWUnLFxuXHRcdFx0XHRcdFx0c2hvcnRfbmFtZTogJ0hvbWUnLFxuXHRcdFx0XHRcdFx0dXJsOiAnLycsXG5cdFx0XHRcdFx0XHRpY29uczogW1xuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0c3JjOiAnL2ltZy9pY29ucy9hbmRyb2lkLWNocm9tZS0xOTJ4MTkyLnBuZycsXG5cdFx0XHRcdFx0XHRcdFx0c2l6ZXM6ICcxOTJ4MTkyJyxcblx0XHRcdFx0XHRcdFx0XHR0eXBlOiAnaW1hZ2UvcG5nJyxcblx0XHRcdFx0XHRcdFx0XHRwdXJwb3NlOiAnYW55Jyxcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdF0sXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XSxcblx0XHRcdH0sXG5cdFx0fSksXG5cdFx0Vml0ZUNzcFBsdWdpbih7XG5cdFx0XHQnYmFzZS11cmknOiBbXG5cdFx0XHRcdCdzZWxmJyxcblx0XHRcdF0sXG5cdFx0XHQnb2JqZWN0LXNyYyc6IFtcblx0XHRcdFx0J3NlbGYnLFxuXHRcdFx0XHQnYmxvYjonLFxuXHRcdFx0XSxcblx0XHRcdCdzY3JpcHQtc3JjJzogW1xuXHRcdFx0XHQnc2VsZicsXG5cdFx0XHRcdCd1bnNhZmUtZXZhbCcsXG5cdFx0XHRcdCd1bnNhZmUtaGFzaGVzJyxcblx0XHRcdFx0J2h0dHBzOi8vd3d3LnlvdXR1YmUuY29tJyxcblx0XHRcdFx0J2h0dHBzOi8vbm9tZXJjeS50dicsXG5cdFx0XHRcdCdodHRwczovLyoubm9tZXJjeS50dicsXG5cdFx0XHRcdCdodHRwczovL3ZzY29kZS5ub21lcmN5LnR2Jyxcblx0XHRcdFx0J2h0dHBzOi8vdHJhaWxlci5ub21lcmN5LnR2Jyxcblx0XHRcdFx0J2h0dHBzOi8vKi5ub21lcmN5LnR2OionLFxuXHRcdFx0XHQnaHR0cHM6Ly9zc2wucC5qd3BjZG4uY29tL3BsYXllci92LzguMjguMS9qd3BsYXllci5qcycsXG5cdFx0XHRcdC8vICdodHRwczovL3d3dy5nc3RhdGljLmNvbS9jdi9qcy9zZW5kZXIvdjEvY2FzdF9zZW5kZXIuanMnLFxuXHRcdFx0XHQvLyAnaHR0cHM6Ly93d3cuZ3N0YXRpYy5jb20vY2FzdC9zZGsvbGlicy9zZW5kZXIvMS4wL2Nhc3RfZnJhbWV3b3JrLmpzJyxcblx0XHRcdFx0J2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vd2VidnR0LXBhcnNlckAyLjIuMC9wYXJzZXIubWluLmpzJyxcblx0XHRcdFx0J2h0dHBzOi8vc3NsLnAuandwY2RuLmNvbScsXG5cdFx0XHRcdCdodHRwczovL3Zqcy56ZW5jZG4ubmV0Jyxcblx0XHRcdFx0J2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldCcsXG5cdFx0XHRcdC8vICdodHRwczovL2NvbnRlbnQuandwbGF0Zm9ybS5jb20nLFxuXHRcdFx0XHQvLyAnaHR0cHM6Ly93d3cuZ3N0YXRpYy5jb20nLFxuXG5cdFx0XHRcdC8vICdodHRwczovL3VucGtnLmNvbS9jb2RlcGFnZUAxLjE1LjAvY3B0YWJsZS5qcycsXG5cdFx0XHRcdC8vICdodHRwczovL3VucGtnLmNvbS9jb2RlcGFnZUAxLjE1LjAvY3B1dGlscy5qcycsXG5cdFx0XHRcdC8vICdodHRwczovL3N0b3JhZ2Uubm9tZXJjeS50di9sYXJhdmVsL3BsYXllci9qcy9vcGVudHlwZS5taW4uanMnLFxuXHRcdFx0XHQvLyAnaHR0cHM6Ly91bnBrZy5jb20vQHNhYnJlLWpzL3NhYnJlQDAuNS4xLXByZS44YmQ3NjMvZGlzdC91dGlsLm1pbi5qcycsXG5cdFx0XHRcdC8vICdodHRwczovL3VucGtnLmNvbS9Ac2FicmUtanMvc2FicmVAMC41LjEtcHJlLjhiZDc2My9kaXN0L3RleHQtc2VydmVyLm1pbi5qcycsXG5cdFx0XHRcdC8vICdodHRwczovL3VucGtnLmNvbS9Ac2FicmUtanMvc2FicmVAMC41LjEtcHJlLjhiZDc2My9kaXN0L3N1YnRpdGxlLXRhZ3MubWluLmpzJyxcblx0XHRcdFx0Ly8gJ2h0dHBzOi8vdW5wa2cuY29tL0BzYWJyZS1qcy9zYWJyZUAwLjUuMS1wcmUuOGJkNzYzL2Rpc3Qvc3VidGl0bGUtcGFyc2VyLm1pbi5qcycsXG5cdFx0XHRcdC8vICdodHRwczovL3VucGtnLmNvbS9Ac2FicmUtanMvc2FicmVAMC41LjEtcHJlLjhiZDc2My9kaXN0L3N1YnRpdGxlLWV2ZW50Lm1pbi5qcycsXG5cdFx0XHRcdC8vICdodHRwczovL3VucGtnLmNvbS9Ac2FicmUtanMvc2FicmVAMC41LjEtcHJlLjhiZDc2My9kaXN0L3N0eWxlLm1pbi5qcycsXG5cdFx0XHRcdC8vICdodHRwczovL3VucGtnLmNvbS9Ac2FicmUtanMvc2FicmVAMC41LjEtcHJlLjhiZDc2My9kaXN0L3N0eWxlLW92ZXJyaWRlLm1pbi5qcycsXG5cdFx0XHRcdC8vICdodHRwczovL3VucGtnLmNvbS9Ac2FicmUtanMvc2FicmVAMC41LjEtcHJlLjhiZDc2My9kaXN0L3NhYnJlLm1pbi5qcycsXG5cdFx0XHRcdC8vICdodHRwczovL3VucGtnLmNvbS9Ac2FicmUtanMvc2FicmVAMC41LjEtcHJlLjhiZDc2My9kaXN0L3NoYWRlci5taW4uanMnLFxuXHRcdFx0XHQvLyAnaHR0cHM6Ly91bnBrZy5jb20vQHNhYnJlLWpzL3NhYnJlQDAuNS4xLXByZS44YmQ3NjMvZGlzdC9zY2hlZHVsZXIubWluLmpzJyxcblx0XHRcdFx0Ly8gJ2h0dHBzOi8vdW5wa2cuY29tL0BzYWJyZS1qcy9zYWJyZUAwLjUuMS1wcmUuOGJkNzYzL2Rpc3QvcmVuZGVyZXItbWFpbi5taW4uanMnLFxuXHRcdFx0XHQvLyAnaHR0cHM6Ly91bnBrZy5jb20vQHNhYnJlLWpzL3NhYnJlQDAuNS4xLXByZS44YmQ3NjMvZGlzdC9nbG9iYWwtY29uc3RhbnRzLm1pbi5qcycsXG5cdFx0XHRcdC8vICdodHRwczovL3VucGtnLmNvbS9Ac2FicmUtanMvc2FicmVAMC41LjEtcHJlLjhiZDc2My9kaXN0L2NhbnZhcy0yZC1zaGFwZS1yZW5kZXJlci5taW4uanMnLFxuXHRcdFx0XHQvLyAnaHR0cHM6Ly91bnBrZy5jb20vQHNhYnJlLWpzL3NhYnJlQDAuNS4xLXByZS44YmQ3NjMvZGlzdC9jYW52YXMtMmQtdGV4dC1yZW5kZXJlci5taW4uanMnLFxuXHRcdFx0XHQvLyAnaHR0cHM6Ly91bnBrZy5jb20vQHNhYnJlLWpzL3NhYnJlQDAuNS4xLXByZS44YmQ3NjMvZGlzdC9jb2xvci5taW4uanMnLFxuXHRcdFx0XHQvLyAnaHR0cHM6Ly91bnBrZy5jb20vQHNhYnJlLWpzL3NhYnJlQDAuNS4xLXByZS44YmQ3NjMvZGlzdC9mb250LXNlcnZlci5taW4uanMnLFxuXHRcdFx0XHQvLyAnaHR0cHM6Ly91bnBrZy5jb20vQHNhYnJlLWpzL3NhYnJlQDAuNS4xLXByZS44YmQ3NjMvZGlzdC9saWIvQlNwbGluZS5taW4uanMnLFxuXHRcdFx0XHQvLyAnaHR0cHM6Ly91bnBrZy5jb20vQHNhYnJlLWpzL3NhYnJlQDAuNS4xLXByZS44YmQ3NjMvZGlzdC9saWIvZWFyY3V0Lm1pbi5qcycsXG5cdFx0XHRcdCdzaGEyNTYtRzNRMXA0czZMYWNsdHJPZjRCbldpd2RsMXJFcCttbVM2RHdwWHI1ZmpLZz0nLFxuXHRcdFx0XHQnc2hhMjU2LVZBOE8yaEFkb29CMjg4RXBTVHJHTGw3ejNRaWtiV1U5d3dvZWJPL1FhWWs9Jyxcblx0XHRcdFx0J3NoYTI1Ni0rNVhrWkZhenpKbzhuMGlPUDR0aS9jTENNVXVkVGYvL016a2I3eE5QWEljPScsXG5cdFx0XHRcdCdzaGEyNTYtTVM2LzNGQ2c0V2pQOWd3Z2FCR3dMcFJDWTZmWkJnd21oVkNkclByTmYzRT0nLFxuXHRcdFx0XHQnc2hhMjU2LXRRamY4Z3ZiMlJPT01hcEl4RnZGQVlCZVVKMHYxSENiT2NTbUROWEd0RG89Jyxcblx0XHRcdFx0J3NoYTI1Ni0rNVhrWkZhenpKbzhuMGlPUDR0aS9jTENNVXVkVGYvL016a2I3eE5QWEljPScsXG5cdFx0XHRcdCdzaGEyNTYtWEMvZ2Jka25VckNpTGJaZFo4eTk2TTlLVk9Eb29KWUdieHJZN1ArYTFSZz0nLFxuXG5cdFx0XHRcdCdodHRwczovL3N0YXRpYy5jbG91ZGZsYXJlaW5zaWdodHMuY29tJyxcblx0XHRcdF0sXG5cdFx0XHQnc3R5bGUtc3JjJzogW1xuXHRcdFx0XHQnc2VsZicsXG5cdFx0XHRcdCd1bnNhZmUtaW5saW5lJyxcblx0XHRcdFx0J3Vuc2FmZS1ldmFsJyxcblx0XHRcdFx0J2h0dHBzOi8vY2RuLm5vbWVyY3kudHYnLFxuXHRcdFx0XHQnaHR0cHM6Ly9jZG4tZGV2Lm5vbWVyY3kudHYnLFxuXHRcdFx0XHQnaHR0cHM6Ly9zdG9yYWdlLm5vbWVyY3kudHYnLFxuXHRcdFx0XSxcblx0XHRcdCdpbWctc3JjJzogW1xuXHRcdFx0XHQnc2VsZicsXG5cdFx0XHRcdCdibG9iOicsXG5cdFx0XHRcdCdkYXRhOicsXG5cdFx0XHRcdCdodHRwczovL25vbWVyY3kudHYnLFxuXHRcdFx0XHQnaHR0cHM6Ly8qLm5vbWVyY3kudHY6KicsXG5cdFx0XHRcdCdodHRwczovLyoubm9tZXJjeS50dicsXG5cdFx0XHRcdCdodHRwczovLyouc3BvdGlmeS5jb20vKicsXG5cdFx0XHRcdCdodHRwczovLyouYXJjaGl2ZS5vcmcnLFxuXHRcdFx0XHQnaHR0cHM6Ly9hcmNoaXZlLm9yZycsXG5cdFx0XHRcdCdodHRwczovL2NvdmVyYXJ0YXJjaGl2ZS5vcmcnLFxuXHRcdFx0XHQnaHR0cHM6Ly9pLnl0aW1nLmNvbScsXG5cdFx0XHRcdCdodHRwczovL2ltYWdlLnRtZGIub3JnJyxcblx0XHRcdFx0J2h0dHBzOi8vbGFzdGZtLmZyZWV0bHMuZmFzdGx5Lm5ldCcsXG5cdFx0XHRcdCdodHRwczovL2ltYWdlcy5mYW5hcnQudHYnLFxuXHRcdFx0XHQnaHR0cHM6Ly9hc3NldHMuZmFuYXJ0LnR2Jyxcblx0XHRcdFx0J3dzczovLyoubm9tZXJjeS50djoqJyxcblx0XHRcdF0sXG5cdFx0XHQnY29ubmVjdC1zcmMnOiBbXG5cdFx0XHRcdCdzZWxmJyxcblx0XHRcdFx0J2Jsb2I6Jyxcblx0XHRcdFx0J2RhdGE6Jyxcblx0XHRcdFx0J2h0dHBzOi8vbm9tZXJjeS50dicsXG5cdFx0XHRcdCdodHRwczovLyoubm9tZXJjeS50djoqJyxcblx0XHRcdFx0J2h0dHBzOi8vKi5ub21lcmN5LnR2Jyxcblx0XHRcdFx0J2h0dHBzOi8vKi5zcG90aWZ5LmNvbS8qJyxcblx0XHRcdFx0J2h0dHBzOi8vaW1hZ2UudG1kYi5vcmcnLFxuXHRcdFx0XHQnaHR0cHM6Ly93d3cubGFzdC5mbScsXG5cdFx0XHRcdCd3czovLyoubm9tZXJjeS50djoqJyxcblx0XHRcdFx0J3dzOi8vMTkyLjE2OC4yLjIwMToqJyxcblx0XHRcdFx0J3dzczovLyoubm9tZXJjeS50djoqJyxcblx0XHRcdFx0J3dzczovLzEyNy4wLjAuMToqJyxcblx0XHRcdFx0J3dzczovL2xvY2FsaG9zdDoqJyxcblx0XHRcdFx0Ly9cblx0XHRcdFx0Ly8gJ2h0dHBzOi8vdW5wa2cuY29tL0BzYWJyZS1qcy9zYWJyZUAwLjUuMS1wcmUuOGJkNzYzL2Rpc3Qvc2hhZGVycy9jYWNoZS5mcmFnbWVudC5nbHNsJyxcblx0XHRcdFx0Ly8gJ2h0dHBzOi8vdW5wa2cuY29tL0BzYWJyZS1qcy9zYWJyZUAwLjUuMS1wcmUuOGJkNzYzL2Rpc3Qvc2hhZGVycy9jYWNoZS52ZXJ0ZXguZ2xzbCcsXG5cdFx0XHRcdC8vICdodHRwczovL3VucGtnLmNvbS9Ac2FicmUtanMvc2FicmVAMC41LjEtcHJlLjhiZDc2My9kaXN0L3NoYWRlcnMvY2xpcC5mcmFnbWVudC5nbHNsJyxcblx0XHRcdFx0Ly8gJ2h0dHBzOi8vdW5wa2cuY29tL0BzYWJyZS1qcy9zYWJyZUAwLjUuMS1wcmUuOGJkNzYzL2Rpc3Qvc2hhZGVycy9jbGlwLnZlcnRleC5nbHNsJyxcblx0XHRcdFx0Ly8gJ2h0dHBzOi8vdW5wa2cuY29tL0BzYWJyZS1qcy9zYWJyZUAwLjUuMS1wcmUuOGJkNzYzL2Rpc3Qvc2hhZGVycy9lZGdlX2JsdXIuZnJhZ21lbnQuZ2xzbCcsXG5cdFx0XHRcdC8vICdodHRwczovL3VucGtnLmNvbS9Ac2FicmUtanMvc2FicmVAMC41LjEtcHJlLjhiZDc2My9kaXN0L3NoYWRlcnMvZWZmZWN0LnZlcnRleC5nbHNsJyxcblx0XHRcdFx0Ly8gJ2h0dHBzOi8vdW5wa2cuY29tL0BzYWJyZS1qcy9zYWJyZUAwLjUuMS1wcmUuOGJkNzYzL2Rpc3Qvc2hhZGVycy9nYXVzc19ibHVyLjEuZnJhZ21lbnQuZ2xzbCcsXG5cdFx0XHRcdC8vICdodHRwczovL3VucGtnLmNvbS9Ac2FicmUtanMvc2FicmVAMC41LjEtcHJlLjhiZDc2My9kaXN0L3NoYWRlcnMvZ2F1c3NfYmx1ci4yLmZyYWdtZW50Lmdsc2wnLFxuXHRcdFx0XHQvLyAnaHR0cHM6Ly91bnBrZy5jb20vQHNhYnJlLWpzL3NhYnJlQDAuNS4xLXByZS44YmQ3NjMvZGlzdC9zaGFkZXJzL3Bvc2l0aW9uaW5nLmZyYWdtZW50Lmdsc2wnLFxuXHRcdFx0XHQvLyAnaHR0cHM6Ly91bnBrZy5jb20vQHNhYnJlLWpzL3NhYnJlQDAuNS4xLXByZS44YmQ3NjMvZGlzdC9zaGFkZXJzL3Bvc2l0aW9uaW5nLnZlcnRleC5nbHNsJyxcblx0XHRcdF0sXG5cdFx0XHQnZnJhbWUtc3JjJzogW1xuXHRcdFx0XHQnc2VsZicsXG5cdFx0XHRcdCdodHRwczovL25vbWVyY3kudHYnLFxuXHRcdFx0XHQnaHR0cHM6Ly8qLm5vbWVyY3kudHY6KicsXG5cdFx0XHRcdCdodHRwczovL2F1dGgtZGV2Lm5vbWVyY3kudHYnLFxuXHRcdFx0XHQnaHR0cHM6Ly9hdXRoLWRldi5ub21lcmN5LnR2LyonLFxuXHRcdFx0XHQnaHR0cHM6Ly93d3cueW91dHViZS5jb20nLFxuXHRcdFx0XSxcblx0XHRcdCdmb250LXNyYyc6IFtcblx0XHRcdFx0J3NlbGYnLFxuXHRcdFx0XHQnYmxvYjonLFxuXHRcdFx0XHQnZGF0YTonLFxuXHRcdFx0XHQnaHR0cHM6Ly9jZG4ubm9tZXJjeS50dicsXG5cdFx0XHRcdCdodHRwczovL2Nkbi1kZXYubm9tZXJjeS50dicsXG5cdFx0XHRdLFxuXHRcdFx0J21lZGlhLXNyYyc6IFtcblx0XHRcdFx0J3NlbGYnLFxuXHRcdFx0XHQnYmxvYjonLFxuXHRcdFx0XHQnZGF0YTonLFxuXHRcdFx0XHQnaHR0cHM6Ly9ub21lcmN5LnR2Jyxcblx0XHRcdFx0J2h0dHBzOi8vKi5ub21lcmN5LnR2Jyxcblx0XHRcdFx0J2h0dHBzOi8vKi5ub21lcmN5LnR2OionLFxuXHRcdFx0XHQnd3NzOi8vKi5ub21lcmN5LnR2OionLFxuXHRcdFx0XSxcblx0XHRcdCd3b3JrZXItc3JjJzogW1xuXHRcdFx0XHQnc2VsZicsXG5cdFx0XHRcdCdibG9iOicsXG5cdFx0XHRdLFxuXHRcdH0sIHtcblx0XHRcdGVuYWJsZWQ6IHRydWUsXG5cdFx0XHRoYXNoaW5nTWV0aG9kOiAnc2hhMjU2Jyxcblx0XHRcdGhhc2hFbmFibGVkOiB7XG5cdFx0XHRcdCdzY3JpcHQtc3JjJzogdHJ1ZSxcblx0XHRcdFx0J3N0eWxlLXNyYyc6IGZhbHNlLFxuXHRcdFx0XHQnc2NyaXB0LXNyYy1hdHRyJzogZmFsc2UsXG5cdFx0XHRcdCdzdHlsZS1zcmMtYXR0cic6IGZhbHNlLFxuXHRcdFx0fSxcblx0XHRcdG5vbmNlRW5hYmxlZDoge1xuXHRcdFx0XHQnc2NyaXB0LXNyYyc6IGZhbHNlLFxuXHRcdFx0XHQnc3R5bGUtc3JjJzogZmFsc2UsXG5cdFx0XHR9LFxuXHRcdFx0cHJvY2Vzc0ZuOiAnTmdpbngnLFxuXHRcdH0pLFxuXHRcdFZpdGVNaW5pZnlQbHVnaW4oKSxcblx0XHQvLyBnemlwUGx1Z2luKCksXG5cdF0sXG5cdHNlcnZlcjoge1xuXHRcdHBvcnQ6IDU1MDEsXG5cdFx0aG9zdDogdHJ1ZSxcblx0fSxcblx0cHJldmlldzoge1xuXHRcdHBvcnQ6IDU1MDEsXG5cdFx0aG9zdDogdHJ1ZSxcblx0fSxcblx0YnVpbGQ6IHtcblx0XHRzb3VyY2VtYXA6IHRydWUsXG5cdFx0Y2h1bmtTaXplV2FybmluZ0xpbWl0OiAxMDI0MDAsXG5cdFx0ZW1wdHlPdXREaXI6IHRydWUsXG5cdFx0bWluaWZ5OiAnZXNidWlsZCcsXG5cdFx0cm9sbHVwT3B0aW9uczoge1xuXHRcdFx0cHJlc2VydmVFbnRyeVNpZ25hdHVyZXM6ICdleHBvcnRzLW9ubHknLFxuXHRcdFx0dHJlZXNoYWtlOiAncmVjb21tZW5kZWQnLFxuXHRcdFx0b3V0cHV0OiB7XG5cdFx0XHRcdHNvdXJjZW1hcDogdHJ1ZSxcblx0XHRcdFx0Y29tcGFjdDogdHJ1ZSxcblx0XHRcdFx0ZXNNb2R1bGU6IHRydWUsXG5cdFx0XHRcdG1pbmlmeUludGVybmFsRXhwb3J0czogdHJ1ZSxcblx0XHRcdFx0c2FuaXRpemVGaWxlTmFtZTogdHJ1ZSxcblx0XHRcdFx0bWFudWFsQ2h1bmtzOiB7XG5cdFx0XHRcdFx0Ly8gTWVkaWFTZXNzaW9uOiBbJy9yZXNvdXJjZXMvdHMvbGliL01lZGlhU2Vzc2lvbi50cyddLFxuXHRcdFx0XHRcdC8vIFNvY2tldENsaWVudDogWycvcmVzb3VyY2VzL3RzL2xpYi9jbGllbnRzL1NvY2tldENsaWVudC9pbmRleC50cyddLFxuXHRcdFx0XHRcdC8vIHN0cmluZ0FycmF5OiBbJy9yZXNvdXJjZXMvdHMvbGliL3N0cmluZ0FycmF5LnRzJ10sXG5cdFx0XHRcdFx0Ly8gdXVpZEhlbHBlcjogWycvcmVzb3VyY2VzL3RzL2xpYi91dWlkSGVscGVyLnRzJ10sXG5cdFx0XHRcdFx0Ly8gY29sb3JIZWxwZXI6IFsnL3Jlc291cmNlcy90cy9saWIvY29sb3JIZWxwZXIudHMnXSxcblx0XHRcdFx0XHQvLyBtdXNpY1BsYXllcjogWycvcmVzb3VyY2VzL3RzL2xpYi9NdXNpY1BsYXllci9pbmRleC50cyddLFxuXHRcdFx0XHR9LFxuXHRcdFx0fSxcblx0XHR9LFxuXHR9LFxuXHRvcHRpbWl6ZURlcHM6IHtcblx0XHRleGNsdWRlOiBbXSxcblx0XHRmb3JjZTogdHJ1ZSxcblx0XHRlc2J1aWxkT3B0aW9uczoge1xuXHRcdFx0bWluaWZ5OiB0cnVlLCAvLyBNaW5pZnkgdGhlIGNvZGVcblx0XHRcdG1pbmlmeVN5bnRheDogdHJ1ZSxcblx0XHRcdG1pbmlmeUlkZW50aWZpZXJzOiB0cnVlLFxuXHRcdFx0bWluaWZ5V2hpdGVzcGFjZTogdHJ1ZSxcblx0XHRcdHRyZWVTaGFraW5nOiB0cnVlLCAvLyBkZWFkIGNvZGUgZWxpbWluYXRpb25cblx0XHRcdC8vIHNwbGl0dGluZzogdHJ1ZSwgLy8gY3JlYXRlIGNodW5rc1xuXHRcdFx0Zm9ybWF0OiAnZXNtJyxcblx0XHRcdHNvdXJjZW1hcDogdHJ1ZSxcblx0XHRcdGRyb3BMYWJlbHM6IFsnREVWJ10sXG5cdFx0XHRwbHVnaW5zOiBbXSxcblx0XHRcdHRhcmdldDogJ2VzMjAyMCcsXG5cdFx0fVxuXHR9LFxuXHRyZXNvbHZlOiB7XG5cdFx0YWxpYXM6IHtcblx0XHRcdCdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG5cdFx0XHQnQEljb25zJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vcmVzb3VyY2VzL2ljb25zJyksXG5cdFx0fSxcblx0fSxcblx0Y3NzOiB7XG5cdFx0cHJlcHJvY2Vzc29yT3B0aW9uczoge1xuXHRcdFx0c2Nzczoge1xuXHRcdFx0XHRhcGk6ICdtb2Rlcm4tY29tcGlsZXInLFxuXHRcdFx0fSxcblx0XHR9LFxuXHR9LFxufSk7XG5cbi8vIEZ1bmN0aW9uIHRvIGNvcHkgYXNzZXRzXG5jb25zdCBjb3B5QXNzZXRzID0gKG91dHB1dEZpbGVzLCBtb2RlKSA9PiB7XG5cdC8vIElmIHRoZSBtb2RlIGlzICdkZXZlbG9wbWVudCcgYW5kIHRoZSAnZGlzdCcgZGlyZWN0b3J5IGV4aXN0cywgcmVtb3ZlIGl0XG5cdGlmKG1vZGUgPT09ICdkZXZlbG9wbWVudCcgJiYgZnMuZXhpc3RzU3luYygnZGlzdCcpKSB7XG5cdFx0ZnMucm1TeW5jKCdkaXN0JywgeyByZWN1cnNpdmU6IHRydWUsIGZvcmNlOiB0cnVlIH0pO1xuXHR9XG5cblx0Ly8gRGVmaW5lIHRoZSBwYXRoIG9mIHRoZSBvdXRwdXQgSFRNTCBmaWxlXG5cdGNvbnN0IG91dHB1dEh0bWxGaWxlID0gJy4vZGlzdC9pbmRleC5odG1sJztcblxuXHQvLyBDb3B5IHRoZSAncHVibGljJyBkaXJlY3RvcnkgdG8gdGhlICdkaXN0JyBkaXJlY3Rvcnlcblx0ZnMuY3BTeW5jKCcuL3B1YmxpYycsICcuL2Rpc3QnLCB7cmVjdXJzaXZlOiB0cnVlfSk7XG5cblx0Ly8gR2VuZXJhdGUgdGhlIHNjcmlwdCB0YWdzIGZvciB0aGUgb3V0cHV0IGZpbGVzXG5cdGNvbnN0IG91dHB1dFNjcmlwdHMgPSBvdXRwdXRGaWxlc1xuXHRcdC5tYXAoY2h1bmsgPT4gYCAgICA8c2NyaXB0IHR5cGU9XCJtb2R1bGVcIiBzcmM9XCIuLyR7cGF0aC5iYXNlbmFtZShjaHVuay5wYXRoKX1cIj48L3NjcmlwdD5gKVxuXHRcdC5qb2luKCdcXG4nKTtcblxuXHQvLyBSZWFkIHRoZSBjb250ZW50IG9mIHRoZSBvdXRwdXQgSFRNTCBmaWxlXG5cdGNvbnN0IGh0bWxOZXdDb250ZW50ID0gZnNcblx0XHQucmVhZEZpbGVTeW5jKG91dHB1dEh0bWxGaWxlLCB7IGVuY29kaW5nOiAndXRmOCcsIGZsYWc6ICdyJyB9KVxuXHRcdC5yZXBsYWNlKCc8L2JvZHk+JywgYCR7b3V0cHV0U2NyaXB0c31cXG48L2JvZHk+YCk7IC8vIFJlcGxhY2UgdGhlICc8L2JvZHk+JyB0YWcgd2l0aCB0aGUgc2NyaXB0IHRhZ3MgYW5kIHRoZSAnPC9ib2R5PicgdGFnXG5cblx0Ly8gV3JpdGUgdGhlIG5ldyBjb250ZW50IHRvIHRoZSBvdXRwdXQgSFRNTCBmaWxlXG5cdGZzLndyaXRlRmlsZVN5bmMob3V0cHV0SHRtbEZpbGUsIGh0bWxOZXdDb250ZW50KTtcbn07XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsT0FBTyxVQUFVO0FBRWpCLFNBQVEsb0JBQW1CO0FBQzNCLFNBQVEsZUFBYztBQUN0QixTQUFRLHFCQUFvQjtBQUU1QixTQUFTLHdCQUF3QjtBQUNqQyxPQUFPLFNBQVM7QUFSaEIsSUFBTSxtQ0FBbUM7QUFZekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDM0IsU0FBUztBQUFBLElBQ1IsSUFBSSxDQUNKLENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFNRCxRQUFRO0FBQUEsTUFDUCxjQUFjO0FBQUEsTUFDZCxnQkFBZ0I7QUFBQSxNQUNoQixTQUFTO0FBQUEsUUFDUix1QkFBdUI7QUFBQSxRQUN2QixXQUFXO0FBQUEsUUFDWCxhQUFhO0FBQUEsUUFDYiwrQkFBK0I7QUFBQSxNQUNoQztBQUFBLE1BQ0EsVUFBVTtBQUFBLFFBQ1QsTUFBTTtBQUFBLFFBQ04sWUFBWTtBQUFBLFFBQ1osYUFDQztBQUFBLFFBQ0QsWUFBWTtBQUFBLFVBQ1g7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFFBQ0Q7QUFBQSxRQUNBLGFBQWE7QUFBQSxRQUNiLGtCQUFrQjtBQUFBO0FBQUEsUUFFbEIsU0FBUztBQUFBLFFBQ1QsYUFBYTtBQUFBLFFBQ2IsT0FBTztBQUFBLFFBQ1AsV0FBVztBQUFBLFFBQ1gsa0JBQWtCO0FBQUEsVUFDakI7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLFFBQ0Q7QUFBQSxRQUNBLGdCQUFnQjtBQUFBLFFBQ2hCLElBQUk7QUFBQSxRQUNKLG1CQUFtQjtBQUFBLFVBQ2xCO0FBQUEsWUFDQyxVQUFVO0FBQUEsWUFDVixLQUFLO0FBQUEsVUFDTjtBQUFBLFFBQ0Q7QUFBQSxRQUNBLDZCQUE2QjtBQUFBLFFBQzdCLE9BQU87QUFBQSxVQUNOO0FBQUEsWUFDQyxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxTQUFTO0FBQUEsVUFDVjtBQUFBLFVBQ0E7QUFBQSxZQUNDLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLFNBQVM7QUFBQSxVQUNWO0FBQUEsVUFDQTtBQUFBLFlBQ0MsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsU0FBUztBQUFBLFVBQ1Y7QUFBQSxVQUNBO0FBQUEsWUFDQyxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxTQUFTO0FBQUEsVUFDVjtBQUFBLFVBQ0E7QUFBQSxZQUNDLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLFNBQVM7QUFBQSxVQUNWO0FBQUEsVUFDQTtBQUFBLFlBQ0MsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsU0FBUztBQUFBLFVBQ1Y7QUFBQSxVQUNBO0FBQUEsWUFDQyxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxTQUFTO0FBQUEsVUFDVjtBQUFBLFVBQ0E7QUFBQSxZQUNDLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxZQUNQLFNBQVM7QUFBQSxVQUNWO0FBQUEsVUFDQTtBQUFBLFlBQ0MsS0FBSztBQUFBLFlBQ0wsT0FBTztBQUFBLFlBQ1AsU0FBUztBQUFBLFVBQ1Y7QUFBQSxVQUNBO0FBQUEsWUFDQyxLQUFLO0FBQUEsWUFDTCxPQUFPO0FBQUEsWUFDUCxTQUFTO0FBQUEsVUFDVjtBQUFBLFFBQ0Q7QUFBQSxRQUNBLGFBQWEsQ0FBQztBQUFBLFFBQ2QsV0FBVztBQUFBLFVBQ1Y7QUFBQSxZQUNDLE1BQU07QUFBQSxZQUNOLFlBQVk7QUFBQSxZQUNaLEtBQUs7QUFBQSxZQUNMLE9BQU87QUFBQSxjQUNOO0FBQUEsZ0JBQ0MsS0FBSztBQUFBLGdCQUNMLE9BQU87QUFBQSxnQkFDUCxNQUFNO0FBQUEsZ0JBQ04sU0FBUztBQUFBLGNBQ1Y7QUFBQSxZQUNEO0FBQUEsVUFDRDtBQUFBLFFBQ0Q7QUFBQSxNQUNEO0FBQUEsSUFDRCxDQUFDO0FBQUEsSUFDRCxjQUFjO0FBQUEsTUFDYixZQUFZO0FBQUEsUUFDWDtBQUFBLE1BQ0Q7QUFBQSxNQUNBLGNBQWM7QUFBQSxRQUNiO0FBQUEsUUFDQTtBQUFBLE1BQ0Q7QUFBQSxNQUNBLGNBQWM7QUFBQSxRQUNiO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUE7QUFBQTtBQUFBLFFBR0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsUUF5QkE7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUVBO0FBQUEsTUFDRDtBQUFBLE1BQ0EsYUFBYTtBQUFBLFFBQ1o7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Q7QUFBQSxNQUNBLFdBQVc7QUFBQSxRQUNWO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRDtBQUFBLE1BQ0EsZUFBZTtBQUFBLFFBQ2Q7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7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
