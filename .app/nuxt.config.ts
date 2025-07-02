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

  nitro: {
    devProxy: {
      '/api/openrouter': {
        target: 'https://openrouter.ai/api/v1',
        changeOrigin: true,
        prependPath: false,
      },
    },
  },

  runtimeConfig: {
    public: {
      appUrl: process.env.PUBLIC_APP_URL || 'http://localhost:3000',
      openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
      dargahMerchantId: process.env.DARGAH_MERCHANT_ID || '',
      dargahBaseUrl: process.env.DARGAH_BASE_URL || 'https://dargahno.net',
      dargahUsername: process.env.DARGAH_USERNAME || '',
      dargahPassword: process.env.DARGAH_PASSWORD || '',
    },
  },
  // modules: [
  //   '@vite-pwa/nuxt'
  // ],
})
