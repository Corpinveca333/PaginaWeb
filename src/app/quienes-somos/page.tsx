// import { getPageByUri } from '@/services/wordpress'; // Ajusta la ruta si es necesario
// import type { WpPage } from '@/services/wordpress'; // Ajusta la ruta si es necesario
// import { notFound } from 'next/navigation';
// import Image from 'next/image';
import type { Metadata } from 'next';
import { getPaginaBySlugSupabase, PaginaEstatica } from '@/services/supabase';
import SafeHtmlRenderer from '@/components/SafeHtmlRenderer';

// Función para generar metadatos dinámicos (título de la página)
export async function generateMetadata(): Promise<Metadata> {
  const pageData: PaginaEstatica | null = await getPaginaBySlugSupabase('quienes-somos');

  if (!pageData) {
    return {
      title: 'Quiénes Somos | Corpinveca',
      description:
        'Conoce más sobre Corpinveca y nuestra misión de proporcionar soluciones tecnológicas innovadoras.',
    };
  }

  return {
    title: pageData.title || 'Quiénes Somos | Corpinveca',
    description:
      pageData.meta_description ||
      'Conoce más sobre Corpinveca y nuestra misión de proporcionar soluciones tecnológicas innovadoras.',
  };
}

// Componente de Página
export default async function QuienesSomosPage() {
  const pageData: PaginaEstatica | null = await getPaginaBySlugSupabase('quienes-somos');

  if (!pageData) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark mb-8 text-center">
            Quiénes Somos
          </h1>
          <p className="text-center text-body-color max-w-2xl mx-auto">
            Lo sentimos, el contenido no está disponible en este momento.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero/Breadcrumb Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 lg:pt-40 lg:pb-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark mb-4">
            {pageData.title}
          </h1>
          {pageData.meta_description && (
            <p className="text-base sm:text-lg text-body-color max-w-2xl mx-auto">
              {pageData.meta_description}
            </p>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-lg">
            {pageData.content && <SafeHtmlRenderer dirtyHtml={pageData.content} />}
          </div>
        </div>
      </section>
    </div>
  );
}
