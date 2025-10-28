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
        items: [
          {
            title: 'تغییر تم',
            component: 'DemoThemeToggle',
          },
          {
            // Title displayed in the sidebar
            title: 'جلسات',
            icon: { name: 'ph:chats', class: 'w-7 h-7' },
            activePath: '/hamdel/sessions',
            to: '/hamdel/sessions',
            class:
              'text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300',
            click: () => {},
          },
          {
            // Title displayed in the sidebar
            title: 'کارهای نیک',
            icon: { name: 'ph:hands-praying', class: 'w-7 h-7' },
            activePath: '/deeds/start',
            to: '/deeds/start',
            class:
              'text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300',
            click: () => {},
          },
          {
            title: 'خانه',
            icon: { name: 'ph:house-duotone', class: 'w-5 h-5' },
            to: '/dashboard',
            position: 'end',
          },
          {
            title: 'گزارش باگ',
            component: 'BugReportIcon',
            position: 'end',
          },
          {
            title: 'My Account',
            component: 'DemoAccountMenu',
            position: 'end',
          },
        ],
      },
    },
  },
});
