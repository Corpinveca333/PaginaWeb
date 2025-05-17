import { notFound } from 'next/navigation';
// import Image from 'next/image'; // No utilizada
import type { Metadata } from 'next';
import { getProductBySlug, getProducts, ProductPost } from '@/services/wordpress';
// import AddToRequestButton from '@/components/AddToRequestButton'; // No utilizada
import ProductCard from '@/components/ProductCard';

interface ProductoDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  const productos = await getProducts();

  if (!productos || productos.length === 0) {
    return [];
  }

  return productos.map((producto: ProductPost) => ({
    slug: producto.slug,
  }));
}

export async function generateMetadata({ params }: ProductoDetailPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const producto = await getProductBySlug(slug);

  if (!producto) {
    return {
      title: 'Producto no encontrado | Corpinveca',
    };
  }

  const pageTitle = `${producto.title} | Productos Corpinveca`;
  const pageDescription =
    producto.excerpt || producto.content?.substring(0, 155) || `Detalles sobre ${producto.title}`;

  return {
    title: pageTitle,
    description: pageDescription.replace(/<[^>]*>?/gm, ''),
  };
}

export default async function ProductoDetailPage({ params }: ProductoDetailPageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const producto = await getProductBySlug(slug);

  if (!producto) {
    notFound();
  }

  // Preparar datos para JSON-LD
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.corpinveca.com';
  const canonicalUrl = `${siteUrl}/productos/${producto.slug}`;

  // Limpiar la descripción de HTML y truncarla si es necesario
  let cleanDescription = '';
  if (producto.excerpt) {
    cleanDescription = producto.excerpt.replace(/<[^>]*>?/gm, '').trim();
  } else if (producto.content) {
    cleanDescription =
      producto.content
        .replace(/<[^>]*>?/gm, '')
        .substring(0, 250)
        .trim() + '...';
  } else {
    cleanDescription = `Detalles sobre el producto ${producto.title} ofrecido por Corpinveca.`;
  }
  if (cleanDescription.length > 160) {
    cleanDescription = cleanDescription.substring(0, 157).trim() + '...';
  }

  // Construir el objeto JSON-LD
  const productoJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.title,
    description: cleanDescription,
    image: producto.featuredImage?.node?.sourceUrl || `${siteUrl}/placeholder-product-image.jpg`,
    sku: producto.camposDeProducto?.numeroDeParteSku || undefined,
    mpn: producto.camposDeProducto?.numeroDeParteSku || undefined,
    brand: {
      '@type': 'Brand',
      name: 'Corpinveca',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: producto.camposDeProducto?.precio?.toString() || '0.00',
      availability: 'https://schema.org/InStock',
      url: canonicalUrl,
      seller: {
        '@type': 'Organization',
        name: 'Corpinveca',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productoJsonLd, null, 2) }}
      />
      <div className="bg-white min-h-[calc(100vh-80px)]">
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">{producto.title}</h1>

          <ProductCard
            producto={producto}
            displayMode="detail"
            containerClassName="max-w-sm mx-auto"
          />
        </div>
      </div>
    </>
  );
}
