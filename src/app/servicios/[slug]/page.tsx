import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServicioBySlugSupabase, getAllServiciosSupabase, Servicio } from '@/services/supabase';
import ServiceCard from '@/components/ServiceCard';

interface ServicioDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: ServicioDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const servicio: Servicio | null = await getServicioBySlugSupabase(slug);

  if (!servicio) {
    return { title: 'Servicio no encontrado | Corpinveca' };
  }

  const pageTitle = `${servicio.title} | Servicios Corpinveca`;
  let pageDescription =
    servicio.excerpt?.replace(/<[^>]*>?/gm, '') ||
    servicio.content?.substring(0, 155).replace(/<[^>]*>?/gm, '') ||
    `Información sobre el servicio ${servicio.title}`;

  if (pageDescription.length > 160) {
    pageDescription = pageDescription.substring(0, 157).trim() + '...';
  }

  return {
    title: pageTitle,
    description: pageDescription,
  };
}

export async function generateStaticParams() {
  const servicios = await getAllServiciosSupabase();
  if (!servicios || servicios.length === 0) {
    return [];
  }
  return servicios.map(servicio => ({
    slug: servicio.slug,
  }));
}

export default async function ServicioDetailPage({
  params,
  searchParams,
}: ServicioDetailPageProps) {
  const { slug } = await params;
  const servicio: Servicio | null = await getServicioBySlugSupabase(slug);

  if (!servicio) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.corpinveca.com';
  const canonicalUrl = `${siteUrl}/servicios/${servicio.slug}`;

  // Preparar descripción para JSON-LD
  let cleanDescription =
    servicio.excerpt?.replace(/<[^>]*>?/gm, '') ||
    servicio.content?.substring(0, 250).replace(/<[^>]*>?/gm, '') ||
    `Detalles sobre ${servicio.title}`;

  if (servicio.alcance_del_servicio) {
    cleanDescription += ` Alcance: ${servicio.alcance_del_servicio.replace(/<[^>]*>?/gm, '').trim()}`;
  }

  if (cleanDescription.length > 300) {
    cleanDescription = cleanDescription.substring(0, 297).trim() + '...';
  }

  const servicioJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: servicio.title,
    description: cleanDescription,
    image:
      servicio.featured_image_url ||
      servicio.icono_url ||
      `${siteUrl}/placeholder-service-image.jpg`,
    url: canonicalUrl,
    provider: {
      '@type': 'Organization',
      name: 'Corpinveca',
      url: siteUrl,
      logo: `${siteUrl}/logo.svg`,
    },
    serviceType: servicio.title,
    areaServed: {
      '@type': 'Country',
      name: 'Venezuela',
    },
    ...(servicio.precio && typeof servicio.precio === 'number'
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: servicio.precio.toString(),
            url: canonicalUrl,
            seller: {
              '@type': 'Organization',
              name: 'Corpinveca',
              url: siteUrl,
            },
          },
        }
      : {}),
    potentialAction: {
      '@type': 'ReserveAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/solicitud?servicio=${encodeURIComponent(servicio.title)}`,
        actionPlatform: [
          'https://schema.org/DesktopWebPlatform',
          'https://schema.org/MobileWebPlatform',
        ],
      },
      name: `Solicitar ${servicio.title}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicioJsonLd, null, 2) }}
      />
      <div className="bg-white min-h-screen">
        <section className="pt-24 pb-12 md:pt-32 md:pb-16 lg:pt-40 lg:pb-20 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark mb-4">
              {servicio.title}
            </h1>
            {servicio.excerpt && (
              <p className="text-base sm:text-lg text-body-color max-w-2xl mx-auto">
                {servicio.excerpt.replace(/<[^>]*>?/gm, '')}
              </p>
            )}
          </div>
        </section>

        <section className="py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <ServiceCard
                servicio={servicio}
                displayMode="detail"
                containerClassName="max-w-3xl mx-auto"
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
