import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getProyectoBySlug } from '@/services/wordpress';
import ProjectCard from '@/components/ProjectCard';

interface ProyectoDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProyectoDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const proyecto = await getProyectoBySlug(slug);

  if (!proyecto) {
    return {
      title: 'Proyecto no encontrado | Corpinveca',
    };
  }

  const pageTitle = `${proyecto.title} | Proyectos Corpinveca`;
  const projectDescription =
    proyecto.camposDeProyecto?.detallesalcanceDelProyecto ||
    proyecto.content?.substring(0, 155) ||
    `Conoce más sobre nuestro proyecto: ${proyecto.title}`;

  return {
    title: pageTitle,
    description: projectDescription.replace(/<[^>]*>?/gm, ''),
  };
}

export default async function ProyectoDetailPage({ params }: ProyectoDetailPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const proyecto = await getProyectoBySlug(slug);
  if (!proyecto) {
    notFound();
  }

  // Preparar datos para JSON-LD
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.corpinveca.com';
  const canonicalUrl = `${siteUrl}/proyectos/${proyecto.slug}`;

  // Prepara la descripción y el cuerpo del artículo (limpiando HTML)
  let shortDescription = '';
  if (proyecto.excerpt) {
    shortDescription = proyecto.excerpt.replace(/<[^>]*>?/gm, '').trim();
  } else if (proyecto.camposDeProyecto?.detallesalcanceDelProyecto) {
    shortDescription =
      proyecto.camposDeProyecto.detallesalcanceDelProyecto
        .replace(/<[^>]*>?/gm, '')
        .substring(0, 160)
        .trim() + '...';
  } else if (proyecto.content) {
    shortDescription =
      proyecto.content
        .replace(/<[^>]*>?/gm, '')
        .substring(0, 160)
        .trim() + '...';
  } else {
    shortDescription = `Detalles sobre el proyecto ${proyecto.title} realizado por Corpinveca.`;
  }

  if (shortDescription.length > 160) {
    shortDescription = shortDescription.substring(0, 157).trim() + '...';
  }

  let articleBodyContent =
    (proyecto.content || '') +
    '\n\n' +
    (proyecto.camposDeProyecto?.detallesalcanceDelProyecto || '');
  articleBodyContent = articleBodyContent.replace(/<[^>]*>?/gm, '').trim();

  const images = [proyecto.featuredImage?.node?.sourceUrl];
  if (proyecto.camposDeProyecto?.galeriaDeImagenes?.node?.sourceUrl) {
    images.push(proyecto.camposDeProyecto.galeriaDeImagenes.node.sourceUrl);
  }
  const validImages = images.filter(Boolean) as string[];

  const proyectoJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: proyecto.title,
    description: shortDescription,
    image: validImages.length > 0 ? validImages : [`${siteUrl}/placeholder-project-image.jpg`],
    articleBody: articleBodyContent,
    author: {
      '@type': 'Organization',
      name: 'Corpinveca',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Corpinveca',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.svg`,
      },
    },
    datePublished:
      proyecto.camposDeProyecto?.fechaDeRealizacion || proyecto.date || new Date().toISOString(),
    dateModified:
      proyecto.camposDeProyecto?.fechaDeRealizacion || proyecto.date || new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    url: canonicalUrl,
    ...(proyecto.camposDeProyecto?.cliente
      ? {
          mentions: [
            {
              '@type': 'Organization',
              name: proyecto.camposDeProyecto.cliente,
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
