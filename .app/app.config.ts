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
            activePath: '/darmana/patients/choosePatient',
            to: '/darmana/patients/choosePatient',
            class: 'text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300',
            click: () => {
            },
          },
          {
            // Title displayed in the sidebar
            title: 'مشاوران',
            icon: { name: 'ph:robot', class: 'w-7 h-7' },
            activePath: '/darmana/therapists/chooseTherapist',
            to: '/darmana/therapists/chooseTherapist',
            class: 'text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300',
            click: () => {
            },
          },
          {
            // Title displayed in the sidebar
            title: 'ویدیوهای معرفی شده',
            icon: { name: 'ph:video', class: 'w-7 h-7' },
            activePath: '/videos/list',
            to: '/videos/list',
            class: 'text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300',
            click: () => {
            },
          },
          {
            // Title displayed in the sidebar
            title: 'مقالات',
            icon: { name: 'ph:book', class: 'w-7 h-7' },
            activePath: '/posts/list',
            to: '/posts/list',
            class: 'text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300',
            click: () => {
            },
          },
          {
            title: 'خانه',
            icon: { name: 'ph:house-duotone', class: 'w-5 h-5' },
            to: '/dashboard',
            position: 'end',
          },
          {
            title: 'Search',
            icon: { name: 'ph:magnifying-glass-duotone', class: 'w-5 h-5' },
            click: () => {
              const isOpen = useState('search-open', () => false)
              isOpen.value = true
            },
            position: 'end',
          },
          {
            title: 'Settings',
            icon: { name: 'ph:gear-six-duotone', class: 'w-5 h-5' },
            to: '/layouts/settings',
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
})
