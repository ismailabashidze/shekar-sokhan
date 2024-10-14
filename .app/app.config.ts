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
        items: [
          {
            // Title displayed in the sidebar
            title: 'صفحه گفت و گو',
            icon: { name: 'ph:chat-circle', class: 'w-5 h-5' },
            activePath: '/mana/chat',
            to: '/mana/chat',
            class: 'text-muted-400 hover:text-primary-500 hover:bg-primary-500/20 flex size-12 items-center justify-center rounded-2xl transition-colors duration-300',
            click: () => {
              alert('clicked on layouts')
            },
          },
        ],
      },
    },
  },
})
