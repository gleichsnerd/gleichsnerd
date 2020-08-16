module.exports = {
  purge: [],
  theme: {
    typography: {
      default: {
        css: {
          color: '#050F0C',
          a: {
            color: '#5BC0BE',
            '&:hover': {
              color: '#586F7C',
            },
          },
        },
      },
    },
    extend: {
      colors: {
        primary: '#5BC0BE',
        'primary-light': '#5BC0BE47'
      },
      fontFamily: {
        'sans': ['"Space Grotesk"']
      },
      maxHeight: {
        'card': '14rem'
      },
      boxShadow: {
        // default: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        default: '0 10px 15px -3px theme("colors.primary-light"), 0 4px 6px -2px theme("colors.primary-light")',
      }
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography')
  ],
}
