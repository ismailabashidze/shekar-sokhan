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

  // Disable devtools in production
  devtools: { enabled: process.env.NODE_ENV === 'development' },

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

  // PWA configuration
  pwa: {
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{js,css,html,png,svg,ico,jpg,jpeg,webp}'],
      navigateFallback: null,
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts.googleapis.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts.gstatic.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'gstatic-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
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
      enabled: false,
      suppressWarnings: true,
      navigateFallback: '/',
      navigateFallbackAllowlist: [/^\/$/],
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
      // Speed up production builds
      chunkSizeWarningLimit: 2000,
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Reduce bundle size with terser (alternative to esbuild)
      // terserOptions: {
      //   compress: {
      //     drop_console: true,
      //     drop_debugger: true
      //   }
      // }
    },
    // Optimize deps for faster builds
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
      __VUE_PROD_DEVTOOLS__: false,
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
    transpile: process.env.NODE_ENV === 'production' ? [
      // Only transpile specific heavy libraries in production
      '@vueup/vue-quill',
      'quill'
    ] : ['@iconify/vue'],
  },

  // Experimental features for faster builds
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
    treeShake: true,
  },

  // Optimization for faster builds
  optimization: {
    // Split chunks for better caching
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // Create a vendor chunk for node_modules
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'all',
        },
        // Create separate chunks for Tairo components
        tairo: {
          name: 'tairo',
          test: /[\\/]layers[\\/]/,
          priority: 20,
          chunks: 'all',
        }
      }
    }
  }
})