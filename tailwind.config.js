module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      spacing: {
        'small': '0.5rem',    
        'medium': '1rem',     
        'large': '2rem',      
      },
      colors: {
        'adp-red': '#D0271D',
        'adp-navy': '#121C4E',
        'adp-white': '#FFFFFF',
      }
    }
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {

        // Image styles
        '.img-small': {
          width: '50px',
          height: 'auto',
        },
        '.img-medium': {
          width: '100px',
          height: 'auto',
        },
        '.img-large': {
          width: '150px',
          height: 'auto',
        },

        // Padding styles
        '.p-small': {
          padding: 'var(--tw-space-small)', 
        },
        '.p-medium': {
          padding: 'var(--tw-space-medium)',
        },
        '.p-large': {
          padding: 'var(--tw-space-large)',
        },

        // Margin styles
        '.m-small': {
          margin: 'var(--tw-space-small)',
        },
        '.m-medium': {
          margin: 'var(--tw-space-medium)',
        },
        '.m-large': {
          margin: 'var(--tw-space-large)',
        },

        // Text styles
        '.txt-small': {
          fontSize: '0.875rem',
        },
        '.txt-medium': {
          fontSize: '1rem',
          fontWeight: '500',
        },
        '.txt-large': {
          fontSize: '1.25rem',
        },
        '.txt-xl': {
          fontSize: '1.5rem',
        },

        // Button styles
        '.btn-primary': {
          backgroundColor: '#D0271D',
          color: '#FFFFFF',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          fontWeight: '600',
        },
        '.btn-secondary': {
          backgroundColor: '#121C4E',
          color: '#FFFFFF',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          fontWeight: '600',
        },
        '.btn-destructive': {
          backgroundColor: '#F2635D',
          color: '#FFFFFF',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          fontWeight: '600',
        },

        // Input styles
        '.input-text': {
          border: '1px solid #121C4E',
          padding: '0.5rem',
          borderRadius: '0.375rem',
        },
        '.input-search': {
          border: '1px solid #D0271D',
          padding: '0.5rem',
          borderRadius: '0.375rem',
        },

        // Card styles
        '.card-outlined': {
          border: '1px solid #D0271D',
          padding: '1rem',
          borderRadius: '0.5rem',
        },
        '.card-filled': {
          backgroundColor: '#F5F5F5',
          padding: '1rem',
          borderRadius: '0.5rem',
        },
        '.card-bordered': {
          border: '2px solid #121C4E',
          padding: '1rem',
          borderRadius: '0.5rem',
        },
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
}
