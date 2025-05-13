import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    'node_modules/flowbite-react/lib/esm/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00539C', // Azul Rey
          light: '#3B82F6', // Azul claro de ejemplo
          dark: '#003366', // Azul oscuro de ejemplo
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        accent: {
          DEFAULT: '#C66900', // Naranja Ladrillo
          light: '#FFA500', // Naranja claro de ejemplo
          dark: '#8B4513', // Marrón oscuro de ejemplo
        },
        'electric-blue': '#007BFF',
        'off-white': '#F8F9FA',
        'light-gray': '#E9ECEF', // Alternativa más fría para el botón
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'], // Poppins como fuente sans-serif principal
      },
    },
  },
  plugins: [require('flowbite/plugin'), require('daisyui')],
};

export default config;
