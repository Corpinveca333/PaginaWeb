import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServiceBySlug, getServices } from '@/services/wordpress';
import ServiceCard from '@/components/ServiceCard';
import { Servicio } from '@/services/wordpress';

interface ServicioDetailPageProps {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: ServicioDetailPageProps): Promise<Metadata> {
  const slug = params.slug;
  const servicio = await getServiceBySlug(slug);

  if (!servicio) {
    return {
      title: 'Servicio no encontrado',
    };
  }

  return {
    title: servicio.title,
    description: servicio.excerpt,
  };
}

export async function generateStaticParams() {
  const servicios = await getServices();

  return servicios.map((servicio: Servicio) => ({
    slug: servicio.slug,
  }));
}

export default async function ServicioDetailPage({ params }: ServicioDetailPageProps) {
  const slug = params.slug;
  const servicio = await getServiceBySlug(slug);

  if (!servicio) {
    notFound();
  }

  // Preparar datos para JSON-LD
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.corpinveca.com';
  const canonicalUrl = `${siteUrl}/servicios/${servicio.slug}`;

  // Limpiar la descripción de HTML y truncarla si es necesario
  let cleanDescription = '';
  if (servicio.excerpt) {
    cleanDescription = servicio.excerpt.replace(/<[^>]*>?/gm, '').trim();
  } else if (servicio.content) {
    cleanDescription =
      servicio.content
        .replace(/<[^>]*>?/gm, '')
        .substring(0, 250)
        .trim() + '...';
  } else {
    cleanDescription = `Información sobre el servicio ${servicio.title} ofrecido por Corpinveca.`;
  }

  // Añadir el alcance del servicio si está disponible
  if (servicio.camposDeServicio?.alcanceDelServicio) {
    cleanDescription += ` Alcance: ${servicio.camposDeServicio.alcanceDelServicio.replace(/<[^>]*>?/gm, '').trim()}`;
  }

  // Recortar la descripción si es muy larga
  if (cleanDescription.length > 300) {
    cleanDescription = cleanDescription.substring(0, 297).trim() + '...';
  }

  // Construir el objeto JSON-LD
  const servicioJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: servicio.title,
    description: cleanDescription,
    image:
      servicio.featuredImage?.node?.sourceUrl ||
      servicio.camposDeServicio?.iconoDelServicio?.node?.sourceUrl ||
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
    ...(servicio.camposDeServicio?.precio && typeof servicio.camposDeServicio.precio === 'number'
      ? {
          offers: {
            '@type': 'Offer',
            priceCurrency: 'USD',
            price: servicio.camposDeServicio.precio.toString(),
            url: canonicalUrl,
            seller: {
              '@type': 'Organization',
              name: 'Corpinveca',
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
          'https://schema.org/IOSPlatform',
          'https://schema.org/AndroidPlatform',
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
      <div className="bg-white min-h-[calc(100vh-80px)]">
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">{servicio.title}</h1>

          <ServiceCard
            servicio={servicio}
            displayMode="detail"
            containerClassName="max-w-sm mx-auto"
          />
        </div>
      </div>
    </>
  );
}
