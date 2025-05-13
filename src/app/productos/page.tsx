import type { Metadata } from 'next';
import { getProducts, ProductPost } from '@/services/wordpress';
import ProductCard from '@/components/ProductCard';

export async function generateMetadata(): Promise<Metadata> {
  // Podrías hacer una llamada a la API aquí si necesitas datos dinámicos para la descripción,
  // pero para un listado general, un texto estático suele ser suficiente.
  const pageTitle = 'Nuestros Productos | Corpinveca';
  const pageDescription =
    'Descubre la gama de productos industriales y tecnológicos que Corpinveca ofrece.';

  return {
    title: pageTitle,
    description: pageDescription,
    // openGraph: { // Opcional: Para redes sociales
    //   title: pageTitle,
    //   description: pageDescription,
    // },
  };
}

export default async function ProductosPage() {
  const productos = await getProducts();

  return (
    <div className="bg-white min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">Nuestros Productos</h1>
        {productos && productos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {productos.map((producto: ProductPost) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-700">No hay productos disponibles en este momento.</p>
        )}
      </div>
    </div>
  );
}
