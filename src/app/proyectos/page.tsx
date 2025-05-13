import type { Metadata } from 'next';
import { getAllProyectos, ProyectoNode } from '@/services/wordpress';
import ProjectCard from '@/components/ProjectCard';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  const pageTitle = 'Nuestros Proyectos | Corpinveca';
  const pageDescription =
    'Explora los proyectos innovadores y soluciones a medida implementadas por Corpinveca en diversas industrias.'; // Puedes personalizar esta descripción

  return {
    title: pageTitle,
    description: pageDescription,
    // openGraph: { // Opcional
    //   title: pageTitle,
    //   description: pageDescription,
    // },
  };
}

export default async function ProyectosPage() {
  const proyectos = await getAllProyectos();

  return (
    <div className="bg-white min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">Nuestros Proyectos</h1>
        {proyectos && proyectos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {proyectos.map((proyecto: ProyectoNode) => (
              <ProjectCard key={proyecto.id} proyecto={proyecto} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-700">No hay proyectos disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
}
