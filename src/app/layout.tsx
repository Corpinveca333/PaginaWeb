import type { Metadata } from 'next';
// La plantilla podría manejar las fuentes de forma diferente, a menudo a través de Tailwind config o CSS.
// import { Inter } from 'next/font/google'; // Comentado por ahora
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RequestListProvider } from '@/context/RequestListContext';
import FloatingActionButtons from '@/components/FloatingActionButtons';
// Importar un ThemeProvider es común en estas plantillas
// import { ThemeProvider } from 'next-themes'; // Asumiendo que usaremos next-themes

// const inter = Inter({ subsets: ['latin'] }); // Comentado por ahora

export const metadata: Metadata = {
  title: 'Corpinveca - Soluciones Industriales', // Mantener metadatos existentes
  description:
    'Empresa líder en soluciones industriales, ofreciendo productos y servicios de alta calidad para el sector industrial.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      {/* Eliminado espacio en blanco que era hijo directo de <html> */}
      {/* suppressHydrationWarning es útil con next-themes */}
      {/* Las fuentes de Google Fonts se pueden manejar en globals.css o tailwind.config.js si la plantilla lo prefiere */}
      {/* <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;800&display=swap"
          rel="stylesheet"
        />
      </head> */}
      {/* className del body puede ser gestionado por ThemeProvider o la plantilla */}
      <body>
        <RequestListProvider>
          <Header />
          <main className="flex-grow pt-[80px]">{children}</main>
          <Footer />
          <FloatingActionButtons />
        </RequestListProvider>
      </body>
    </html>
  );
}
