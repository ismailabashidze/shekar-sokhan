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
    title: 'پنل جامع هوش مصنوعی',
    sidebar: {
      // toolbar: {
      //   tools: [
      //     {
      //       component: 'DemoThemeToggle',
      //       props: {
      //         disableTransitions: false,
      //       },
      //     },
      //   ],
      // },
      navigation: {
        logo: {
          component: 'img',
          props: {
            src: '/img/logo.png',
            alt: 'Logo',
            class: 'h-10',
          },
        },
        items: [
          {
            // Title displayed in the sidebar
            title: 'مراجعان',
            icon: { name: 'ph:chalkboard-teacher', class: 'w-7 h-7' },
            activePath: '/onboarding/choosePatient',
            to: '/onboarding/choosePatient',
            class: 'text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300',
            click: () => {
            },
          },
          {
            // Title displayed in the sidebar
            title: 'مشاوران',
            icon: { name: 'ph:robot', class: 'w-7 h-7' },
            activePath: '/onboarding/chooseTherapist',
            to: '/onboarding/chooseTherapist',
            class: 'text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300',
            click: () => {
            },
          },
        ],
      },
    },
  },
})
