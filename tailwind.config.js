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
        primary: '#5BC0BE'
      },
      fontFamily: {
        'sans': ['"Space Grotesk"']
      }
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography')
  ],
}
