import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
// import { getProducts, getServices } from '@/services/wordpress'; // Eliminado
// import type { ProductPost, Servicio } from '@/services/wordpress'; // Eliminado
// import TestimonialCard from '@/components/TestimonialCard'; // No utilizado
// Import Swiper React components
// import { Swiper, SwiperSlide } from 'swiper/react'; // No utilizado
// Import Swiper styles
// import 'swiper/css'; // No utilizado
// import 'swiper/css/pagination'; // No utilizado
// import 'swiper/css/navigation'; // No utilizado
// Import Swiper modules
// import { Pagination, Navigation, Autoplay } from 'swiper/modules'; // No utilizado
import TestimonialSlider from '@/components/TestimonialSlider';
import { getAllProductosSupabase, getAllServiciosSupabase } from '../services/supabase'; // Import Supabase functions
// import type { Producto, ServicioListItem } from '../services/supabase'; // No utilizado, se usan Product y Service definidos localmente

// Tipos genéricos para productos y servicios
interface Product {
  id: string;
  title: string;
  slug: string;
  featuredImage?: {
    url: string;
    altText?: string;
  };
  excerpt?: string;
}

interface Service {
  id: string;
  title: string;
  slug: string;
  featuredImage?: {
    url: string;
    altText?: string;
  };
  icon?: {
    url: string;
    altText?: string;
  };
  excerpt?: string;
}

// Iconos para placeholders (puedes reemplazarlos con react-icons o SVGs personalizados)
// const PlaceholderIcon = ({ className }: { className?: string }) => ( // No utilizado
//   <svg
//     className={className || 'w-6 h-6 text-gray-400'}
//     fill="none"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     strokeWidth="2"
//     viewBox="0 0 24 24"
//     stroke="currentColor"
//   >
//     <path d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
//   </svg>
// );

export async function generateMetadata(): Promise<Metadata> {
  const pageTitle = 'Corpinveca: Tu Solución Industrial Innovadora';
  const pageDescription =
    'Somos una empresa líder en el área de mantenimiento, servicio y venta de repuestos en el área industrial. Expertos en automatización y proyectos electromecánicos.';

  return {
    title: pageTitle,
    description: pageDescription,
  };
}

// Datos mockeados para productos
// const mockProducts: Product[] = [ // No utilizado
// ... (contenido de mockProducts eliminado)
// ];

// Datos mockeados para servicios
// const mockServices: Service[] = [ // No utilizado
// ... (contenido de mockServices eliminado)
// ];

// Datos que antes estaban en HomePage, ahora definidos aquí para usarlos en la nueva estructura
// const differentiatorsData = [ // No utilizado
// ... (contenido de differentiatorsData eliminado)
// ];

// NUEVO: Componente para Tarjeta de Producto Destacado
function FeaturedProductCard({ product }: { product: Product }) {
  const { title, slug, featuredImage, excerpt } = product;
  const imageUrl = featuredImage?.url || '/placeholder-product.jpg';

  let shortDescription: string | undefined = undefined;
  if (excerpt) {
    if (excerpt.length > 100) {
      shortDescription = excerpt.substring(0, 100) + '...';
    } else {
      shortDescription = excerpt;
    }
  }

  return (
    <div className="card card-compact w-full bg-custom-rey text-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 h-full flex flex-col">
      <figure className="relative h-48 sm:h-56 bg-gray-700">
        <Image
          alt={title}
          src={imageUrl}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </figure>
      <div className="card-body p-4 flex flex-col flex-grow">
        <h3 className="card-title text-xl font-bold text-white mb-3">{title}</h3>
        {shortDescription && (
          <p className="text-gray-200 text-sm mb-4 flex-grow">{shortDescription}</p>
        )}
        <Link
          href={`/productos/${slug}`}
          className="btn bg-custom-naranja text-white border-custom-naranja hover:bg-white hover:text-black hover:border-black btn-sm mt-auto w-full sm:w-auto transition-all duration-300 transform hover:scale-105"
        >
          Ver Producto
        </Link>
      </div>
    </div>
  );
}

// NUEVO: Componente para Tarjeta de Servicio Destacado
function FeaturedServiceCard({ service }: { service: Service }) {
  const { title, slug, featuredImage, icon, excerpt } = service;
  const imageUrl = icon?.url || featuredImage?.url || '/placeholder-service.jpg';

  let shortDescription: string | undefined = undefined;
  if (excerpt) {
    if (excerpt.length > 100) {
      shortDescription = excerpt.substring(0, 100) + '...';
    } else {
      shortDescription = excerpt;
    }
  }

  return (
    <div className="card card-compact w-full bg-custom-rey text-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 h-full flex flex-col">
      <figure className="relative h-48 sm:h-56 bg-gray-700">
        <Image
          alt={title}
          src={imageUrl}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </figure>
      <div className="card-body p-4 flex flex-col flex-grow">
        <h3 className="card-title text-xl font-bold text-white mb-3">{title}</h3>
        {shortDescription && (
          <p className="text-gray-200 text-sm mb-4 flex-grow">{shortDescription}</p>
        )}
        <Link
          href={`/servicios/${slug}`}
          className="btn bg-custom-naranja text-white border-custom-naranja hover:bg-white hover:text-black hover:border-black btn-sm mt-auto w-full sm:w-auto transition-all duration-300 transform hover:scale-105"
        >
          Conocer Servicio
        </Link>
      </div>
    </div>
  );
}

export default async function HomePage() {
  // Fetch data from Supabase
  const productos = await getAllProductosSupabase(undefined, undefined, 3); // Get 3 products
  const servicios = await getAllServiciosSupabase(undefined, undefined, 2); // Get 2 services

  // Map fetched data to the expected interface types if necessary
  // Note: Assuming the types Producto and ServicioListItem are compatible
  const featuredProducts: Product[] = productos.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    featuredImage: p.featured_image_url ? { url: p.featured_image_url } : undefined,
    excerpt: p.excerpt || undefined, // Supabase type might be string | null
  }));

  const featuredServices: Service[] = servicios.map(s => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    featuredImage: s.featured_image_url ? { url: s.featured_image_url } : undefined,
    icon: s.icono_url ? { url: s.icono_url } : undefined,
    excerpt: s.excerpt || undefined, // Supabase type might be string | null
  }));

  return (
    <>
      {/* Hero Section - Actualizado */}
      <section className="relative bg-white pt-[120px] pb-[80px] md:pt-[150px] md:pb-[120px] lg:pt-[180px] lg:pb-[150px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero-background-modern.jpg"
            alt="Fondo Hero Section Corpinveca"
            fill
            className="object-cover"
            sizes="100vw"
            quality={85}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="font-bold text-white text-4xl sm:text-5xl md:text-6xl lg:text-[64px] leading-tight mb-6">
                  Tu Solución Industrial Innovadora
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
                  Somos una empresa líder en el área de mantenimiento, servicio y venta de repuestos
                  en el área industrial.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/servicios"
                    className="btn bg-custom-naranja hover:bg-white hover:text-black border-custom-naranja hover:border-black text-white btn-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                  >
                    Nuestros Servicios
                  </Link>
                  <Link
                    href="/productos"
                    className="btn btn-outline text-white border-white hover:bg-white hover:text-custom-rey btn-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                  >
                    Nuestros Productos
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - MOVING THIS UP AND RENAMING ID */}
      <section id="testimonials-section" className="py-12 md:py-20 bg-white">
        <div className="container mx-auto">
          <div className="max-w-xl mx-auto text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-black text-center mb-4">
              Escucha a Nuestros Clientes
            </h2>
            <h3 className="text-2xl lg:text-3xl font-semibold text-custom-naranja mb-10 md:mb-12">
              Experiencias Reales, Resultados Reales
            </h3>
            <p className="text-base text-gray-700">
              La confianza y satisfacción de nuestros clientes son nuestro mayor aval. Conoce
              algunas de sus experiencias.
            </p>
          </div>
          <TestimonialSlider />
        </div>
      </section>

      {/* Call to Action / Productos y Servicios Destacados - Actualizado */}
      <section id="featured-content" className="py-12 md:py-20 bg-white">
        <div className="container mx-auto">
          <div className="max-w-xl mx-auto text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-black text-center mb-10 md:mb-12">
              Explora Nuestras Soluciones
            </h2>
            <p className="text-base text-gray-700">
              Descubre cómo nuestros productos y servicios pueden impulsar tu proyecto o negocio.
            </p>
          </div>
          {/* Productos Destacados */}
          {featuredProducts.length > 0 && (
            <div className="mb-16">
              <h3 className="text-2xl sm:text-3xl font-semibold text-black mb-8 text-center md:text-left">
                Productos Destacados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map(product => (
                  <FeaturedProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
          {/* Servicios Destacados */}
          {featuredServices.length > 0 && (
            <div>
              <h3 className="text-2xl sm:text-3xl font-semibold text-black mb-8 text-center md:text-left">
                Servicios Populares
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {featuredServices.map(service => (
                  <FeaturedServiceCard key={service.id} service={service} />
                ))}
              </div>
            </div>
          )}
          {/* Enlace a Proyectos */}
          <div className="mt-16 text-center">
            <h1 className="text-2xl sm:text-3xl font-semibold text-black mb-6">
              Nuestros Proyectos
            </h1>
            <Link
              href="/proyectos"
              className="btn bg-custom-naranja text-white border-custom-naranja hover:bg-white hover:text-black hover:border-black btn-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            >
              Explorar Proyectos
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Final - Mantenido */}
      <section className="py-12 md:py-20 bg-primary">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full lg:w-2/3 px-4">
              <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left mb-8 lg:mb-0">
                <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  ¿Listo para Transformar tu Industria con Corpinveca?
                </h2>
                <p className="text-base text-gray-200">
                  Contáctanos hoy mismo para discutir tus necesidades y cómo podemos ayudarte a
                  alcanzar tus objetivos con soluciones innovadoras y eficientes.
                </p>
              </div>
            </div>
            <div className="w-full lg:w-1/3 px-4">
              <div className="flex justify-center lg:justify-end">
                <Link
                  href="/contacto"
                  className="btn bg-white text-primary border-primary hover:bg-gray-100 hover:text-black hover:border-black py-3.5 px-10 text-base font-semibold shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Habla con un Experto
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
