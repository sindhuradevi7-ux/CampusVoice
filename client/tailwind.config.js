/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Burgundy / Deep Wine (Primary brand color)
        burgundy: {
          50: '#fdf2f4',
          100: '#fbe6ea',
          200: '#f8cfd7',
          300: '#f2aab7',
          400: '#ea758c',
          500: '#d94467',
          600: '#b82348',
          700: '#8c1533',
          800: '#74122b', // Core burgundy matching logo
          850: '#630d22',
          900: '#520b1c', // Deep wine
          950: '#330510',
        },
        // Peach / Coral (Secondary / Accent color)
        peach: {
          50: '#fff8f5',
          100: '#ffede7',
          200: '#fcdbd0',
          300: '#f9bfae',
          400: '#f59f87', // Core logo peach
          500: '#ee7758',
          600: '#db5735',
          700: '#b84223',
          800: '#94361e',
          900: '#7a301d',
          950: '#42160b',
        },
        // Warm White / Cream Surfaces (Light mode base)
        cream: {
          50: '#fdfbf7', // Primary warm white background
          100: '#faf6ee', // Surface cards
          200: '#f4ece0', // Muted panels / secondary surface
          300: '#e8decb', // Borders & dividers
          400: '#d7c7af',
          500: '#bcab91',
          600: '#9e8c73',
          700: '#7c6d59', // Secondary warm text
          800: '#534739', // Body text
          900: '#382f25', // Heading / dark warm text
          950: '#211b14',
        },
        // Wine tones for typography & dark mode surfaces
        wine: {
          50: '#fcf8f9',
          100: '#f8edef',
          200: '#ebd5da',
          300: '#d9b2bc',
          400: '#be8794',
          500: '#9e5f6e',
          600: '#824654',
          700: '#693340',
          800: '#532430',
          900: '#3a141e', // Rich wine dark text
          950: '#1b060d', // Deep wine dark mode background
          980: '#130308',
        },
        // Semantic aliases
        brand: {
          50: '#fdf2f4',
          100: '#fbe6ea',
          200: '#f8cfd7',
          300: '#f2aab7',
          400: '#ea758c',
          500: '#8c1533',
          600: '#74122b',
          700: '#630d22',
          800: '#520b1c',
          900: '#330510',
          950: '#20030a',
        },
        shield: {
          50: '#fff8f5',
          100: '#ffede7',
          200: '#fcdbd0',
          300: '#f9bfae',
          400: '#f59f87',
          500: '#ee7758',
          600: '#db5735',
          700: '#b84223',
          800: '#94361e',
          900: '#7a301d',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(116, 18, 43, 0.25)',
        'peach-glow': '0 0 25px -5px rgba(245, 159, 135, 0.4)',
        'warm': '0 10px 30px -10px rgba(82, 11, 28, 0.08)',
        'warm-lg': '0 20px 40px -15px rgba(82, 11, 28, 0.12)',
        'dark-glow': '0 0 25px -5px rgba(245, 159, 135, 0.15)',
      }
    },
  },
  plugins: [],
}
