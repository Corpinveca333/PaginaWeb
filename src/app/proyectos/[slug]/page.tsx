import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  getProyectoBySlugSupabase,
  getAllProyectosSupabase,
  Proyecto,
  ProyectoListItem,
} from '@/services/supabase';
import ProjectCard from '@/components/ProjectCard';

interface ProyectoDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  const proyectos: ProyectoListItem[] = await getAllProyectosSupabase();
  if (!proyectos || proyectos.length === 0) {
    return [];
  }
  return proyectos.map(proyecto => ({
    slug: proyecto.slug,
  }));
}

export async function generateMetadata({
  params,
  searchParams: _searchParams,
}: ProyectoDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const proyecto: Proyecto | null = await getProyectoBySlugSupabase(slug);

  if (!proyecto) {
    return {
      title: 'Proyecto no encontrado | Corpinveca',
      description: 'El proyecto solicitado no existe o no está disponible.',
    };
  }

  const pageTitle = `${proyecto.title} | Proyectos Corpinveca`;
  const pageDescription =
    proyecto.excerpt || proyecto.content?.substring(0, 155) || `Detalles sobre ${proyecto.title}`;

  return {
    title: pageTitle,
    description: pageDescription.replace(/<[^>]*>?/gm, ''),
  };
}

export default async function ProyectoDetailPage({
  params,
  searchParams: _searchParams,
}: ProyectoDetailPageProps) {
  const { slug } = await params;
  const proyecto: Proyecto | null = await getProyectoBySlugSupabase(slug);

  if (!proyecto) {
    notFound();
  }

  // Preparar datos para JSON-LD
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.corpinveca.com';
  const canonicalUrl = `${siteUrl}/proyectos/${slug}`;

  // Prepara la descripción y el cuerpo del artículo (limpiando HTML)
  const cleanDescription =
    proyecto.excerpt?.replace(/<[^>]*>?/gm, '').trim() ||
    proyecto.content
      ?.replace(/<[^>]*>?/gm, '')
      .substring(0, 250)
      .trim() + '...' ||
    `Detalles sobre el proyecto ${slug} ofrecido por Corpinveca.`;

  const images = [proyecto.featured_image_url, proyecto.imagen_adicional_url].filter(
    Boolean
  ) as string[];

  const proyectoJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Project',
    name: proyecto.title,
    description: cleanDescription,
    image: images.length > 0 ? images : [`${siteUrl}/placeholder-project-image.jpg`],
    url: canonicalUrl,
    ...(proyecto.cliente
      ? {
          mentions: [
            {
              '@type': 'Organization',
              name: proyecto.cliente,
            },
          ],
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(proyectoJsonLd, null, 2) }}
      />
      <div className="bg-white min-h-[calc(100vh-80px)]">
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">{proyecto.title}</h1>
          <ProjectCard
            proyecto={proyecto}
            displayMode="detail"
            containerClassName="max-w-sm mx-auto"
          />
        </div>
      </div>
    </>
  );
}
