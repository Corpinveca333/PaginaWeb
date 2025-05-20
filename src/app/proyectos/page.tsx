import type { Metadata } from 'next';
import { getAllProyectosSupabase, ProyectoListItem } from '@/services/supabase';
import ProjectCard from '@/components/ProjectCard';

// La generación de metadatos se debe mover a un Server Component padre si es necesaria,
// o manejarla de otra forma si la página debe ser client-side.
// Comentada por ahora para la conversión a 'use client'.
/*
export async function generateMetadata(): Promise<Metadata> {
  const pageTitle = 'Nuestros Proyectos | Corpinveca';
  const pageDescription =
    'Explora los proyectos innovadores y soluciones a medida implementadas por Corpinveca en diversas industrias.';

  return {
    title: pageTitle,
    description: pageDescription,
  };
}
*/

export const metadata: Metadata = {
  title: 'Nuestros Proyectos | Corpinveca',
  description:
    'Explora los proyectos innovadores y soluciones a medida implementadas por Corpinveca en diversas industrias.',
};

export default async function ProyectosPage() {
  const proyectos: ProyectoListItem[] = await getAllProyectosSupabase();

  return (
    <div className="bg-white min-h-screen">
      {/* Hero/Breadcrumb Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 lg:pt-40 lg:pb-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark mb-4">
            Nuestros Proyectos
          </h1>
          <p className="text-base sm:text-lg text-body-color max-w-2xl mx-auto">
            Explora algunos de los proyectos exitosos que hemos realizado para nuestros clientes.
          </p>
        </div>
      </section>

      {/* Project Listing Section */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          {/* Placeholder para Filtros de Proyectos */}
          <div className="mb-12 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-sm">
            <div className="flex flex-wrap justify-center items-center gap-3">
              <span className="text-sm font-medium text-dark mr-2">Filtrar por:</span>
              <button className="px-4 py-2 text-xs sm:text-sm rounded-md bg-gray-200 hover:bg-primary hover:text-white transition-colors">
                Industria A
              </button>
              <button className="px-4 py-2 text-xs sm:text-sm rounded-md bg-gray-200 hover:bg-primary hover:text-white transition-colors">
                Industria B
              </button>
              <button className="px-4 py-2 text-xs sm:text-sm rounded-md bg-gray-200 hover:bg-primary hover:text-white transition-colors">
                Ver Todos
              </button>
            </div>
            <div>
              <select
                className="px-4 py-2 text-xs sm:text-sm rounded-md border border-gray-300 bg-white text-dark focus:ring-primary focus:border-primary"
                aria-label="Ordenar proyectos"
              >
                <option>Ordenar por defecto</option>
                <option>Más recientes</option>
                <option>Más antiguos</option>
              </select>
            </div>
          </div>

          {proyectos && proyectos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              {proyectos.map((proyecto: ProyectoListItem) => (
                <ProjectCard key={proyecto.id} proyecto={proyecto} displayMode="list" />
              ))}
            </div>
          ) : (
            <p className="text-center text-body-color py-10">
              No hay proyectos disponibles en este momento.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
