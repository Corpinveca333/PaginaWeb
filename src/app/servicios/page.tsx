import type { Metadata } from 'next';
import { getAllServiciosSupabase, ServicioListItem } from '@/services/supabase';
import ServiceCard from '@/components/ServiceCard';
import SearchInput from '@/components/SearchInput';

export const metadata: Metadata = {
  title: 'Nuestros Servicios | Corpinveca',
  description:
    'Descubre los servicios profesionales y soluciones que Corpinveca ofrece para optimizar tus operaciones.',
};

export default async function ServiciosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const currentSearchParams = await searchParams;
  const searchTerm =
    typeof currentSearchParams.search === 'string' ? currentSearchParams.search : undefined;

  const servicios: ServicioListItem[] = await getAllServiciosSupabase(searchTerm);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero/Breadcrumb Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 lg:pt-40 lg:pb-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark mb-4">
            Nuestros Servicios
          </h1>
          <p className="text-base sm:text-lg text-body-color max-w-2xl mx-auto">
            Soluciones integrales y personalizadas para optimizar tus operaciones industriales.
          </p>
        </div>
      </section>

      {/* Services Listing Section */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          {/* Controles de búsqueda y ordenación */}
          <div className="mb-12 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-sm">
            {/* Usar el componente SearchInput */}
            <SearchInput placeholder="Buscar servicios..." className="w-full sm:w-auto" />
            <div>
              <select
                className="px-4 py-2 text-xs sm:text-sm rounded-md border border-gray-300 bg-white text-dark focus:ring-primary focus:border-primary"
                aria-label="Ordenar servicios"
              >
                <option>Ordenar por defecto</option>
                <option>Más populares</option>
                <option>Alfabéticamente</option>
              </select>
            </div>
          </div>

          {servicios && servicios.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              {servicios.map((servicio: ServicioListItem) => (
                <ServiceCard key={servicio.id} servicio={servicio} displayMode="list" />
              ))}
            </div>
          ) : (
            <p className="text-center text-body-color py-10">
              No hay servicios disponibles en este momento.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
