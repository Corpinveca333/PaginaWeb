// import { getPageByUri } from '@/services/wordpress'; // Ajusta la ruta si es necesario
// import type { WpPage } from '@/services/wordpress'; // Ajusta la ruta si es necesario
import { notFound } from 'next/navigation';
import Image from 'next/image'; // Aunque no haya imagen destacada ahora, es bueno tenerla por si se añade
import type { Metadata } from 'next';
import { getPaginaBySlugSupabase, PaginaEstatica } from '@/services/supabase';
import SafeHtmlRenderer from '@/components/SafeHtmlRenderer';
// import ContactForm from '@/components/ContactForm'; // Eliminar importación del formulario

// Función para generar metadatos dinámicos (título de la página)
export async function generateMetadata(): Promise<Metadata> {
  const pageData: PaginaEstatica | null = await getPaginaBySlugSupabase('contacto');

  if (!pageData) {
    return {
      title: 'Contacto | Corpinveca',
      description:
        'Ponte en contacto con Corpinveca para obtener más información sobre nuestros servicios y soluciones tecnológicas.',
    };
  }

  return {
    title: pageData.title || 'Contacto | Corpinveca',
    description:
      pageData.meta_description ||
      'Ponte en contacto con Corpinveca para obtener más información sobre nuestros servicios y soluciones tecnológicas.',
  };
}

// Componente de Página
export default async function ContactoPage() {
  const pageData: PaginaEstatica | null = await getPaginaBySlugSupabase('contacto');

  if (!pageData) {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark mb-8 text-center">
            Contacto
          </h1>
          <p className="text-center text-body-color">
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
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark mb-4 text-center">
            Contáctanos
          </h1>
          <p className="text-base sm:text-lg text-body-color max-w-2xl mx-auto text-center">
            Estamos aquí para ayudarte. Completa el formulario o utiliza nuestros otros canales de
            comunicación.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 items-start">
            {/* Contact Form */}
            {/* <div className="bg-white rounded-lg shadow-lg p-8">
              <ContactForm />
            </div> */}

            {/* Content */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-dark mb-6">Información de Contacto</h2>
              <div className="prose prose-lg">
                {pageData.content && <SafeHtmlRenderer dirtyHtml={pageData.content} />}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
