module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        'adp-red': '#D0271D',
        'adp-red-light': '#E44A42',
        'adp-navy': '#121C4E',
        'adp-navy-light': '#2A3A6E',
        'adp-navy-dark': '#0A1433',
        'adp-white': '#FFFFFF',
        'adp-gray': '#F5F5F5',
      },
      borderRadius: {
        md: '0.375rem',
        lg: '0.5rem',
      },
      padding: {
        small: '0.5rem',
        medium: '1rem',
      },
      fontFamily: {
        'taub-sans-regular': ['"Taub Sans Regular"', 'sans-serif'],
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        // Image styles
        '.img-small': {
          '@apply w-12 h-auto': {},
        },
        '.img-medium': {
          '@apply w-24 h-auto': {},
        },
        '.img-large': {
          '@apply w-36 h-auto': {},
        },

        // Padding styles
        '.p-small': {
          '@apply p-1': {},
        },
        '.p-medium': {
          '@apply p-2': {},
        },
        '.p-large': {
          '@apply p-4': {},
        },

        // Margin styles
        '.m-small': {
          '@apply m-2': {},
        },
        '.m-medium': {
          '@apply m-4': {},
        },
        '.m-large': {
          '@apply m-8': {},
        },

        // Text styles
        '.text-small': {
          '@apply text-sm': {},
        },
        '.text-normal': {
          '@apply text-base': {},
        },
        '.text-medium': {
          '@apply text-lg': {},
        },
        '.text-large': {
          '@apply text-xl': {},
        },
        '.text-xl': {
          '@apply text-2xl': {},
        },

        // Button styles
        '.btn-primary': {
          '@apply py-1.5 px-3 bg-adp-navy text-white text-small border border-adp-navy-light  rounded-md shadow-sm hover:bg-adp-navy-dark transition-colors':
            {},
        },
        '.btn-secondary': {
          '@apply py-1.5 px-3 bg-adp-white text-adp-navy text-small border border-adp-navy-light  hover:text-adp-white  rounded-md shadow-sm hover:bg-adp-navy-light transition-colors':
            {},
        },
        '.btn-destructive': {
          '@apply py-1.5 px-3 bg-adp-red text-adp-white text-small border border-adp-red-light rounded-md shadow-sm hover:bg-adp-red-light transition-colors':
            {},
        },
        '.btn-disabled': {
          '@apply py-1.5 px-3 bg-gray-700 text-adp-white text-small border border-gray-300 rounded-md shadow-sm transition-colors':
            {},
        },

        // Input styles
        '.input-bordered': {
          '@apply border border-gray-300 transition-colors hover:border-adp-navy p-2 shadow-sm text-normal rounded-md':
            {},
        },
        '.input-filled': {
          '@apply border bg-adp-gray transition-colors hover:border-adp-navy  p-2 shadow-sm text-normal rounded-md':
            {},
        },

        // Card styles
        '.card-filled': {
          '@apply border transition-colors bg-adp-gray hover:border-adp-navy shadow-sm p-medium rounded-lg':
            {},
        },
        '.card-bordered': {
          '@apply border border shadow-sm transition-colors hover:border-adp-navy p-medium rounded-lg':
            {},
        },

        // Error Style
        '.input-error': {
          '@apply text-adp-red bg-red-200 p-medium shadow-sm rounded-lg': {},
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
