import { readFileSync } from 'fs';
import { resolve } from 'path';

// خواندن ورژن از package.json
let appVersion = '3.4.0';
try {
  const packagePath = resolve(__dirname, '../package.json');
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'));
  appVersion = packageJson.version || '3.4.0';
}
catch (error) {
  console.warn('Could not read version from package.json, using fallback:', appVersion);
}

export default defineNuxtConfig({
  extends: [
    /**
     * This extends the base Tairo layer.
     *
     * Alternatively you can use the following:
     * ["gh:cssninjaStudio/tairo/layers/tairo#v1.4.0", {
     *    install: true,
     *    auth: import.meta.env.GITHUB_TOKEN,
     * }]
     *
     * @see https://github.com/unjs/c12#extending-config-layer-from-remote-sources
     *
     * This would allows you to create an empty git repository
     * with only your source code and no demo.
     */

    /**
     * Uncomment the following line to add the Tairo Layout Sidebar layer
     */
    '../layers/tairo-layout-sidebar',
    '../layers/tairo',
  ],

  modules: [
    '@vite-pwa/nuxt',
  ],

  // Set default color mode to light
  colorMode: {
    preference: 'light', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not in user's preference
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '',
    storageKey: 'nuxt-color-mode',
  },

  // Disable devtools in production
  devtools: { enabled: process.env.NODE_ENV === 'development' },

  // Runtime environment variables
  runtimeConfig: {
    public: {
      appVersion,
      appUrl: process.env.PUBLIC_APP_URL || 'http://localhost:4000',
      openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
      openaiApiKey: process.env.OPENAI_API_KEY || '',
      dargahMerchantId: process.env.DARGAH_MERCHANT_ID || '',
      dargahBaseUrl: process.env.DARGAH_BASE_URL || 'https://dargahno.net',
      dargahUsername: process.env.DARGAH_USERNAME || '',
      dargahPassword: process.env.DARGAH_PASSWORD || '',
    },
  },

  app: {
    pageTransition: {
      name: 'page-fade',
      mode: 'default',
    },
    head: {
      meta: [
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'ذهنا' },
        { name: 'application-name', content: 'ذهنا' },
        { name: 'msapplication-TileColor', content: '#4F46E5' },
        { name: 'theme-color', content: '#4F46E5' },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/pwa-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon.ico' },
      ],
    },
  },

  /**
   * Load local font with @fontsource packages
   * @see https://fontsource.org/
   */
  css: [
    '@fontsource-variable/inter/index.css',
    '@fontsource-variable/karla/index.css',
    '~/assets/css/tour.css',
    '~/assets/css/fonts-compat.css',
  ],

  nitro: {
    devProxy: {
      '/api/openrouter': {
        target: 'https://openrouter.ai/api/v1',
        changeOrigin: true,
        prependPath: false,
      },
    },
    // External heavy server-side dependencies to prevent client bundling
    experimental: {
      wasm: false,
    },
    // Bundle server dependencies separately
    bundledStorage: ['redis'],
    // Minify output for production
    minify: process.env.NODE_ENV === 'production',
    // Use esbuild for faster builds
    esbuild: {
      options: {
        target: 'es2022',
        minify: process.env.NODE_ENV === 'production',
      },
    },
  },

  // Server-side rendering optimizations
  ssr: true,

  // Vite build optimizations
  vite: {
    build: {
      target: 'es2022',
      minify: process.env.NODE_ENV === 'production' ? 'esbuild' : false,
      sourcemap: process.env.NODE_ENV === 'development',
      // External heavy dependencies for production builds
      rollupOptions: {
        external: process.env.NODE_ENV === 'production'
          ? [
              'chromadb',
              '@anthropic-ai/sdk',
              '@gradio/client',
            ]
          : [],
      },
    },
    // Optimize deps for faster builds
    optimizeDeps: {
      exclude: [
        'chromadb',
        '@anthropic-ai/sdk',
        '@gradio/client',
      ],
    },
    // Enable faster builds
    define: {
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
    // Server-side externals
    ssr: {
      external: ['chromadb', '@anthropic-ai/sdk', '@gradio/client'],
    },
  },

  // Build optimizations
  build: {
    transpile: process.env.NODE_ENV === 'production' ? [] : ['@iconify/vue'],
  },

  // Experimental features for faster builds
  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: false,
  },

  // TypeScript optimizations
  typescript: {
    typeCheck: false,
  },

  // PWA configuration for service worker
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
    },
    // Use custom service worker for PWA functionality
    filename: 'sw.js',
    strategies: 'injectManifest',
    injectManifest: {
      injectionPoint: 'self.__WB_MANIFEST',
    },
  },
});
