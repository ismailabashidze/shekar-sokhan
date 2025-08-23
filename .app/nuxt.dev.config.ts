import { readFileSync } from 'fs'
import { resolve } from 'path'

// خواندن ورژن از package.json
let appVersion = '2.8.0'
try {
  const packagePath = resolve(__dirname, './package.json')
  const packageJson = JSON.parse(readFileSync(packagePath, 'utf-8'))
  appVersion = packageJson.version || '2.8.0'
}
catch (error) {
  console.warn('Could not read version from package.json, using fallback:', appVersion)
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

  // Optimize for development speed
  devServer: {
    port: 3000,
    host: 'localhost',
  },

  // Disable features that slow down development
  sourcemap: {
    server: false,
    client: false,
  },

  // Disable devtools in production but enable in development
  devtools: { enabled: true },

  // Runtime environment variables
  runtimeConfig: {
    public: {
      appVersion,
      appUrl: process.env.PUBLIC_APP_URL || 'http://localhost:3000',
      openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
      dargahMerchantId: process.env.DARGAH_MERCHANT_ID || '',
      dargahBaseUrl: process.env.DARGAH_BASE_URL || 'https://dargahno.net',
      dargahUsername: process.env.DARGAH_USERNAME || '',
      dargahPassword: process.env.DARGAH_PASSWORD || '',
    },
  },

  app: {
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
  ],

  // Modules configuration for PWA
  modules: [
    '@vite-pwa/nuxt'
  ],

  // PWA configuration for development
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico,jpg,jpeg,webp}'],
      navigateFallback: null,
      cleanupOutdatedCaches: true,
    },
    manifest: {
      name: 'ذهنا - پلتفرم روانشناسی',
      short_name: 'ذهنا',
      theme_color: '#4F46E5',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        }
      ]
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      type: 'module',
      suppressWarnings: true,
      navigateFallback: '/',
    },
  },

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
    // Don't minify in development for faster builds
    minify: false,
  },

  // Server-side rendering optimizations
  ssr: true,

  // Vite build optimizations for development
  vite: {
    build: {
      target: 'es2022',
      minify: false,
      sourcemap: true,
      // External heavy dependencies for development
      rollupOptions: {
        external: [
          'chromadb',
          '@anthropic-ai/sdk',
          '@gradio/client',
        ]
      },
    },
    // Optimize deps for faster development
    optimizeDeps: {
      exclude: [
        'chromadb',
        '@anthropic-ai/sdk',
        '@gradio/client',
      ],
      // Include commonly used dependencies for faster cold starts
      include: [
        'vue',
        'vue-router',
        '@vueuse/core',
        'driver.js',
        'pocketbase'
      ]
    },
    // Enable faster builds
    define: {
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: true,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    },
    // Server-side externals
    ssr: {
      external: ['chromadb', '@anthropic-ai/sdk', '@gradio/client'],
    },
    // Enable caching for faster rebuilds
    cacheDir: '.vite-cache',
  },

  // Build optimizations
  build: {
    transpile: ['@iconify/vue'],
  },

  // Experimental features for faster development
  experimental: {
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: true,
    typedPages: false,
    // Enable faster component initialization
    componentIslands: true,
    // Enable faster async context
    asyncContext: true,
  },

  // TypeScript optimizations
  typescript: {
    typeCheck: false,
  },

  // Performance optimizations
  performance: {
    // Enable tree-shaking for better bundle optimization
    treeShake: false, // Disable in dev for faster builds
  }
})