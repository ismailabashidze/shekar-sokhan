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

  /**
   * Load local font with @fontsource packages
   * @see https://fontsource.org/
   */
  css: [
    '@fontsource-variable/inter/index.css',
    '@fontsource-variable/karla/index.css',
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
    }
  },
})
