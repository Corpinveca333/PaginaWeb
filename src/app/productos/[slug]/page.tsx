import { notFound } from 'next/navigation';
// import Image from 'next/image'; // No utilizada
import type { Metadata } from 'next';
// import { getProductBySlug, getProducts, ProductPost } from '@/services/wordpress';
// import AddToRequestButton from '@/components/AddToRequestButton'; // No utilizada
import ProductCard from '@/components/ProductCard';
import {
  getProductoBySlugSupabase,
  getAllProductosSupabase,
  Producto,
  ProductoListItem,
} from '@/services/supabase';

interface ProductoDetailPageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateStaticParams() {
  const productos: ProductoListItem[] = await getAllProductosSupabase();
  if (!productos || productos.length === 0) {
    return [];
  }
  return productos.map(producto => ({
    slug: producto.slug,
  }));
}

export async function generateMetadata({
  params,
  searchParams,
}: ProductoDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const producto: Producto | null = await getProductoBySlugSupabase(slug);

  if (!producto) {
    return {
      title: 'Producto no encontrado | Corpinveca',
      description: 'El producto solicitado no existe o no está disponible.',
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

export default async function ProductoDetailPage({
  params,
  searchParams,
}: ProductoDetailPageProps) {
  const { slug } = await params;
  const producto: Producto | null = await getProductoBySlugSupabase(slug);

  if (!producto) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.corpinveca.com';
  const cleanDescription =
    producto.excerpt?.replace(/<[^>]*>?/gm, '').trim() ||
    producto.content
      ?.replace(/<[^>]*>?/gm, '')
      .substring(0, 250)
      .trim() + '...' ||
    `Detalles sobre el producto ${slug} ofrecido por Corpinveca.`;

  const productoJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: producto.title,
    description: cleanDescription,
    image: producto.featured_image_url || `${siteUrl}/placeholder-product-image.jpg`,
    sku: producto.sku || undefined,
    mpn: producto.sku || undefined,
    brand: {
      '@type': 'Brand',
      name: 'Corpinveca',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: producto.precio?.toString() || '0.00',
      availability: producto ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${siteUrl}/productos/${slug}`,
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
