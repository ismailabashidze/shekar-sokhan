import { withShurikenUI } from '@shuriken-ui/tailwind'
import colors from 'tailwindcss/colors'

/**
 * This is the Tailwind config file for the demo.
 * It extends the default config from @shuriken-ui/tailwind
 *
 * You can add/override your own customizations here.
 */
export default withShurikenUI({
  content: [],
  theme: {
    // Custom fonts (defaults values are commented out)
    fontFamily: {
      sans: ['IRANSans', 'sans-serif'],
      heading: ['IRANSans', 'sans-serif'],
      alt: ['IRANSans', 'sans-serif'],
      mono: [
        'IRANSans',
        // 'ui-monospace',
        // 'SFMono-Regular',
        // 'Menlo',
        // 'Monaco',
        // 'Consolas',
        // '"Liberation Mono"',
        // '"Courier New"',
        // 'monospace',
      ],
    },
    extend: {
      // Custom colors
      colors: {
        // primary: colors.indigo,
        // muted: colors.slate,
        // info: colors.sky,
        // success: colors.teal,
        // warning: colors.amber,
        // danger: colors.rose,
      },
      nui: {
        tooltip: {
          after: {
            opacity: 1,
            transform: 'translate(0px, -50%)',
          },
        },
      },
    },
  },
  plugins: [],
})
