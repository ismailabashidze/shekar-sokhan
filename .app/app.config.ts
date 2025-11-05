/**
 * This file is used to configure the app
 *
 * If you have the "Cannot find name 'defineAppConfig'.ts(2304)" error
 * update the root tsconfig.json file to include the following:
 *
 *  "extends": "./.app/.nuxt/tsconfig.json"
 *
 */

export default defineAppConfig({
  tairo: {
    title: 'ذهنا',
    panels: [
      {
        name: 'notifications',
        position: 'right',
        component: 'NotificationSidebar',
      },
    ],
    sidebar: {
      navigation: {
        startOpen: false,
        logo: {
          component: 'img',
          props: {
            src: '/img/logo.svg',
            alt: 'Logo',
            class: 'h-10',
          },
          to: '/dashboard',
        },
        // Default items - will be dynamically replaced based on zone by zone-sidebar plugin
        // These are just placeholders that will be overwritten
        items: [],
      },
    },
  },
});
