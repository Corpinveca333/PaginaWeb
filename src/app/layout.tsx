import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RequestListProvider } from '@/context/RequestListContext';
import FloatingActionButtons from '@/components/FloatingActionButtons';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Corpinveca - Soluciones Industriales',
  description:
    'Empresa líder en soluciones industriales, ofreciendo productos y servicios de alta calidad para el sector industrial.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex flex-col min-h-screen">
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
