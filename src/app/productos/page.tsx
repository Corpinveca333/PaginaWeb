import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import DOMPurify from 'dompurify';
import { getAllProductosSupabase, Producto } from '@/services/supabase';
import AddToRequestButton from '@/components/AddToRequestButton'; // Mantener el botón
import ProductCard from '@/components/ProductCard';
import SearchInput from '@/components/SearchInput'; // Importar el nuevo componente

// exportamos metadatos como en un Server Component
export const metadata: Metadata = {
  title: 'Nuestros Productos | Corpinveca',
  description: 'Descubre la gama de productos industriales y tecnológicos que Corpinveca ofrece.',
};

// Componente de Tarjeta de Producto individual (estilo plantilla) - Este podría seguir siendo un Client Component si usa hooks internos o interacciones
// Por ahora, lo mantendremos como estaba, asumiendo que ProductCard maneja su estado interno si es necesario.
function ProductCardItem({ producto }: { producto?: any }) {
  // Modificado: producto es opcional y de tipo any
  const { id, title, slug, featuredImage, camposDeProducto, excerpt } = producto || {}; // Valores por defecto si producto es null/undefined

  const imageUrl = featuredImage?.node?.sourceUrl || '/placeholder-product.jpg';
  const precio = camposDeProducto?.precio;
  const sku = camposDeProducto?.numeroDeParteSku;

  const itemDataForButton = {
    id: id || 'default-id', // Proveer default si id no existe
    name: title || 'Producto Placeholder', // Proveer default
    precio: precio,
    sku: sku || 'PRODUCTO-SKU', // Proveer default
    image: imageUrl,
    slug: slug || '#', // Proveer default
  };

  return (
    <div className="bg-gray-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
      <Link href={slug ? `/productos/${slug}` : '#'} className="block relative w-full h-60 group">
        <Image
          src={imageUrl}
          alt={title || 'Imagen del Producto'} // Proveer default
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <h3
          className="font-semibold text-lg md:text-xl text-dark mb-2 truncate"
          title={title || 'Título no disponible'}
        >
          <Link
            href={slug ? `/productos/${slug}` : '#'}
            className="hover:text-primary transition-colors"
          >
            {title || 'Título del Producto Placeholder'}
          </Link>
        </h3>
        {excerpt && (
          <div
            className="text-body-color text-sm mb-4 flex-grow overflow-hidden line-clamp-3"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(excerpt, { USE_PROFILES: { html: true } }),
            }}
          />
        )}
        {/* Mostrar precio si está disponible */}
        {precio !== undefined &&
          precio !== null && ( // Se mantiene la lógica original, pero los datos pueden ser undefined
            <p className="text-xl font-semibold text-primary mb-3">
              {typeof precio === 'number'
                ? precio.toLocaleString('es-VE', { style: 'currency', currency: 'VES' })
                : 'Precio no disponible'}
            </p>
          )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <Link
            href={slug ? `/productos/${slug}` : '#'}
            className="inline-block text-center rounded-md bg-primary hover:bg-primary-dark py-2 px-4 text-sm font-medium text-white transition duration-300 ease-in-out"
          >
            Ver Detalles
          </Link>
          <AddToRequestButton
            item={itemDataForButton} // itemDataForButton ya maneja valores por defecto
            className="rounded-md bg-secondary hover:bg-opacity-90 py-2 px-4 text-sm font-medium text-white transition duration-300 ease-in-out"
          />
        </div>
      </div>
    </div>
  );
}

// Añadido async y modificado el tipo de searchParams para que sea una Promesa
export default async function ProductosPage({
  searchParams,
}: {
  // Definido el tipo de searchParams como Promesa
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  // Esperar searchParams antes de acceder a sus propiedades
  const currentSearchParams = await searchParams;
  const searchTerm =
    typeof currentSearchParams.search === 'string' ? currentSearchParams.search : undefined;

  // Obtener productos directamente en el servidor
  const fetchedProducts = await getAllProductosSupabase(searchTerm);

  return (
    <div className="bg-white min-h-screen">
      {/* Hero/Breadcrumb Section */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-16 lg:pt-40 lg:pb-20 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark mb-4">
            Nuestros Productos
          </h1>
          <p className="text-base sm:text-lg text-body-color max-w-2xl mx-auto">
            Descubre la gama de productos industriales y tecnológicos que Corpinveca ofrece para
            potenciar tu industria.
          </p>
        </div>
      </section>

      {/* Product Listing Section */}
      <section className="py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4">
          {/* Controles de búsqueda y ordenación */}
          <div className="mb-12 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-sm">
            {/* Usar el componente SearchInput */}
            <SearchInput placeholder="Buscar productos..." className="w-full sm:w-auto" />
            <div>
              {/* Placeholder para ordenación */}
              <select
                className="px-4 py-2 text-xs sm:text-sm rounded-md border border-gray-300 bg-white text-dark focus:ring-primary focus:border-primary"
                aria-label="Ordenar productos"
              >
                <option>Ordenar por defecto</option>
                <option>Más recientes</option>
                <option>Precio: bajo a alto</option>
                <option>Precio: alto a bajo</option>
              </select>
            </div>
          </div>

          {fetchedProducts && fetchedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
              {fetchedProducts.map(producto => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          ) : (
            <p className="text-center text-body-color py-10">
              No hay productos disponibles en este momento.
            </p>
          )}
          {/* TODO: Implementar paginación si es necesario */}
        </div>
      </section>
    </div>
  );
}
