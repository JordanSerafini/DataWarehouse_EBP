/** @type {import('tailwindcss').Config} */
module.exports = {
  // NativeWind v4 (compatible Expo SDK 54+)
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}', // Pour Expo Router quand migré
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Couleurs du thème Material Design 3
        primary: {
          DEFAULT: '#6200ee',
          50: '#f3e5f5',
          100: '#e1bee7',
          200: '#ce93d8',
          300: '#ba68c8',
          400: '#ab47bc',
          500: '#6200ee',
          600: '#8e24aa',
          700: '#7b1fa2',
          800: '#6a1b9a',
          900: '#4a148c',
        },
        secondary: {
          DEFAULT: '#03dac6',
          50: '#e0f7fa',
          100: '#b2ebf2',
          200: '#80deea',
          300: '#4dd0e1',
          400: '#26c6da',
          500: '#03dac6',
          600: '#00acc1',
          700: '#0097a7',
          800: '#00838f',
          900: '#006064',
        },
        tertiary: '#018786',
        error: {
          DEFAULT: '#b00020',
          light: '#ef5350',
          dark: '#c62828',
        },
        background: {
          DEFAULT: '#f5f5f5',
          paper: '#ffffff',
        },
        surface: '#ffffff',
        text: {
          primary: '#000000DE', // 87% opacity
          secondary: '#00000099', // 60% opacity
          disabled: '#00000061', // 38% opacity
        },
      },
      fontFamily: {
        // Utiliser les fonts système
        sans: ['System'],
        mono: ['Courier'],
      },
      spacing: {
        // Espacement Material Design (4dp grid)
        0.5: '2px',
        1: '4px',
        1.5: '6px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px',
      },
      borderRadius: {
        // Rayon Material Design
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '28px',
      },
      elevation: {
        // Élévation Material Design (via shadow)
        0: 'none',
        1: '0px 2px 1px -1px rgba(0,0,0,0.2)',
        2: '0px 3px 1px -2px rgba(0,0,0,0.2)',
        3: '0px 3px 3px -2px rgba(0,0,0,0.2)',
        4: '0px 2px 4px -1px rgba(0,0,0,0.2)',
        6: '0px 3px 5px -1px rgba(0,0,0,0.2)',
        8: '0px 5px 5px -3px rgba(0,0,0,0.2)',
        12: '0px 7px 8px -4px rgba(0,0,0,0.2)',
        16: '0px 8px 10px -5px rgba(0,0,0,0.2)',
        24: '0px 11px 15px -7px rgba(0,0,0,0.2)',
      },
    },
  },
  plugins: [],
  // Dark mode support
  darkMode: 'class', // Utiliser class="dark" pour activer
};
