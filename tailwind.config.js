// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  theme: {
    screens: {
      tablet: '768px',
      // => @media (min-width: 640px) { ... }

      laptop: '1024px',
      // => @media (min-width: 1024px) { ... }

      desktop: '1280px',
      // => @media (min-width: 1280px) { ... }
    },
    fontFamily: {
      display: ['var(--font-display)'],
      body: ['var(--font-body)'],
    },
    extend: {
      colors: {
        primary: {
          default: '#316094',
          hover: '#20466f',
          dark: '#3652D8',
          light: '#e2edfc',
          pieGreen: '#2792a0',
          pieYellow: '#deab1e',
          pieRed: '#a02727',
        },
        secondary: {
          default: '#222222',
          hover: '#f2f3f7',
          light: '#f4f6f8',
          gray: '#e7ecf1',
          gray_hover: '#d0d9e3',
          gray555: '#555555',
          darkgray: '#5b636d',
          black111: '#111111',
        },
        input: {
          border: '#DEE4EB',
          focus: '#75869B',
          error: '#FF6969',
          api: '#212936',
        },
        fontColor: {
          default111: '#111111',
          default222: '#222222',
          default888: '#888888',
          gray: '#949ca5',
          darkgray: '#5b636d',
          on: '#316094',
          info: colors.cyan['500'],
          success: colors.green['600'],
          danger: colors.red['600'],
          pieGreen: '#2792a0',
          pieYellow: '#deab1e',
          pieRed: '#a02727',
        },
        bd: {
          default: '#e9ebed',
          lightgray: '#e7ecf1',
          gray: '#d0d9e3',
          gray02: '#e2e2e2',
          gray03: '#dee4eb',
          darkgray: '#75869b',
          darkgray02: '#5b636d',
          on: '#316094',
        },
        sh: {
          light: '#dff4db',
          dark: '#122c48',
          primary: '#d2dcca',
        },
        summary: {
          positive: '#4593d3',
          negative: '#ff4d4d',
          neutral: '#fa5',
          mix: '#949ca5',
        },
        fontGray: '#949ca5',
        sideMenu: {
          default: '#e2edfc',
          shadow: '#d2dcea',
        },
        //normal btn
        normal: {
          hover: '#f2f3f7',
          border: '#d0d9e3',
          check: '#F4F7FA',
        },
        default: '#222',
        excelBtn: '#34ad7a',
        light: '#888',
      },
      scrollbarHide: {
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      },
      boxShadow: {
        sm: '0px 1px 0px',
        md: '0px 2px 8px',
        spread: '0 0 4px 4px',
      },
      width: {
        120: '30rem',
        160: '40rem',
        200: '50rem',
        'fill-available': '-webkit-fill-available',
      },
      spacing: {
        150: '38rem',
      },
      borderRadius: {
        small: '0.188rem',
        medium: '0.375rem',
        large: '0.625rem',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
  ],
};
