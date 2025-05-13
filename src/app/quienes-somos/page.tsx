import { getPageByUri } from '@/services/wordpress'; // Ajusta la ruta si es necesario
import type { WpPage } from '@/services/wordpress'; // Ajusta la ruta si es necesario
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import SafeHtmlRenderer from '@/components/SafeHtmlRenderer';

// Función para generar metadatos dinámicos (título de la página)
export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageByUri('quienes-somos');
  if (!pageData) {
    return {
      title: 'Página no encontrada',
    };
  }
  return {
    title: `${pageData.title} | Corpinveca`, // Asumiendo que quieres añadir el nombre del sitio
    // description: pageData.excerpt || "Información sobre Corpinveca", // Podrías añadir descripción si la tienes
  };
}

// Componente de Página
export default async function QuienesSomosPage() {
  const pageData = await getPageByUri('quienes-somos');

  if (!pageData) {
    notFound();
  }

  return (
    <div className="bg-white min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <article className="max-w-3xl mx-auto">
          {/* Título de la Página */}
          <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">{pageData.title}</h1>

          {/* Imagen Destacada (Opcional) */}
          {pageData.featuredImage?.node?.sourceUrl && (
            <div className="relative w-full h-64 md:h-80 mb-8 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={pageData.featuredImage.node.sourceUrl}
                alt={pageData.featuredImage.node.altText || pageData.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 90vw, 768px"
                priority
                quality={85}
              />
            </div>
          )}

          {/* Contenido de la Página (del editor de WordPress) */}
          {pageData.content && (
            <SafeHtmlRenderer
              dirtyHtml={pageData.content}
              className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            />
          )}

          {/* Podrías añadir aquí más secciones o componentes si esta página lo requiere */}
        </article>
      </div>
    </div>
  );
}
