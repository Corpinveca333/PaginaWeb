import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // './node_modules/flowbite-react/lib/esm/**/*.js', // Comentado temporalmente
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    extend: {
      colors: {
        primary: '#3056D3', // Color primario de la plantilla
        'primary-dark': '#24409A', // Variante oscura del primario
        secondary: '#13C296', // Color secundario de la plantilla
        dark: '#1D2144', // Fondo oscuro principal
        'body-color': '#788293', // Color de texto del cuerpo principal
        'body-color-dark': '#A0AEC0', // Color de texto del cuerpo para modo oscuro (ejemplo)
        // Mantener algunos de tus colores si son muy específicos y no conflictivos,
        // o eliminarlos si la plantilla cubre sus usos.
        // Por ahora, me enfoco en los de la plantilla.
        // accent: { ... }, // Comentado temporalmente
        'royal-blue': '#1E3A8A', // Azul rey para header y footer
        orange: '#F97316', // Naranja para botones
        white: '#FFFFFF', // Blanco para fondo y textos de descripción
        black: '#000000', // Negro para títulos h1 y h2
        'custom-rey': '#0052CC', // Azul Rey
        'custom-naranja': '#FF6600', // Naranja
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Fuente principal de la plantilla
      },
      boxShadow: {
        // Sombras comunes en plantillas
        sticky: '0px 0px 10px rgba(0, 0, 0, 0.07)',
        card: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        button: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'button-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  // plugins: [require('flowbite/plugin'), require('daisyui')], // Comentado temporalmente
  plugins: [], // Sin plugins por ahora para una base limpia
  daisyui: {
    themes: ['light'],
  },
};

export default config;
