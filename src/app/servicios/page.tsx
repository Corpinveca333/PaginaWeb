import type { Metadata } from 'next';
import { getServices, Servicio } from '@/services/wordpress';
import ServiceCard from '@/components/ServiceCard';

export async function generateMetadata(): Promise<Metadata> {
  const pageTitle = 'Nuestros Servicios | Corpinveca';
  const pageDescription =
    'Descubre los servicios industriales y tecnológicos especializados que Corpinveca ofrece para optimizar tus operaciones.'; // Puedes personalizar esta descripción

  return {
    title: pageTitle,
    description: pageDescription,
    // openGraph: { // Opcional
    //   title: pageTitle,
    //   description: pageDescription,
    // },
  };
}

export default async function ServiciosPage() {
  const servicios = await getServices();

  return (
    <div className="bg-white min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">Nuestros Servicios</h1>
        {servicios && servicios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicios.map((servicio: Servicio) => (
              <ServiceCard key={servicio.id} servicio={servicio} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-700">No hay servicios disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
}
