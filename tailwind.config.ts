import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#000',
          secondary: '#000',
          accent: '#dc2626',
          neutral: '#000',
          'base-100': '#fff',
          info: '#000',
          success: '#d9f99d',
          warning: '#fed7aa',
          error: '#fecaca',
          '--rounded-box': '0px', // border radius rounded-box utility class, used in card and other large boxes
          '--rounded-btn': '0px', // border radius rounded-btn utility class, used in buttons and similar element
          '--rounded-badge': '0px', // border radius rounded-badge utility class, used in badges and similar
          '--tab-radius': '0px', // border radius of tabs
        },
      },
    ],
  },
  darkMode: 'class',
}
export default config

