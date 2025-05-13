import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { Card } from 'flowbite-react';
import DifferentiatorItem from '@/components/DifferentiatorItem';
import CallToActionCard from '@/components/CallToActionCard';

export async function generateMetadata(): Promise<Metadata> {
  const pageTitle = 'Corpinveca: Ingeniería Innovadora para la Industria del Mañana';
  const pageDescription =
    'Desde la automatización hasta proyectos electromecánicos a medida. Creamos el futuro de tu producción, hoy. Conoce nuestros servicios, productos y proyectos.';

  return {
    title: pageTitle,
    description: pageDescription,
  };
}

export default function HomePage() {
  const differentiators = [
    {
      title: 'Experiencia Comprobada',
      description:
        'Más de 20 años en el sector industrial validan nuestra capacidad para entregar resultados sólidos y confiables en cada proyecto.',
      imageSrc: '/tarjeta01.jpeg',
      imageAlt: 'Ilustración o foto representando experiencia comprobada en la industria',
    },
    {
      title: 'Soluciones a Medida',
      description:
        'Entendemos que cada desafío es único. Diseñamos e implementamos soluciones personalizadas que se adaptan perfectamente a tus necesidades.',
      imageSrc: '/tarjeta02.jpeg',
      imageAlt: 'Engranajes o diseño abstracto simbolizando soluciones personalizadas',
    },
    {
      title: 'Compromiso con Calidad',
      description:
        'Nos regimos por los más altos estándares, asegurando la excelencia, durabilidad y rendimiento óptimo en todos nuestros servicios y productos.',
      imageSrc: '/tarjeta03.jpeg',
      imageAlt: 'Símbolo de calidad o detalle de manufactura precisa',
    },
    {
      title: 'Atención al Cliente',
      description:
        'Tu satisfacción es nuestra prioridad. Ofrecemos un acompañamiento cercano y respuestas eficientes antes, durante y después de cada proyecto.',
      imageSrc: '/tarjeta05.jpeg',
      imageAlt: 'Icono o imagen representando comunicación y soporte al cliente',
    },
  ];

  const ctaCardsData = [
    {
      title: 'Nuestros Productos',
      description:
        'Innovación y eficiencia en nuestra gama de productos tecnológicos e industriales.',
      imageSrc: '/carrito1212.jpg',
      imageAlt: 'Productos Corpinveca',
      buttonText: 'Ver Productos',
      linkHref: '/productos',
    },
    {
      title: 'Servicios Especializados',
      description:
        'Soluciones integrales y mantenimiento experto para optimizar tus operaciones industriales.',
      imageSrc: '/servicio1212.jpg',
      imageAlt: 'Servicios Corpinveca',
      buttonText: 'Conocer Servicios',
      linkHref: '/servicios',
    },
    {
      title: 'Proyectos de Ingeniería',
      description:
        'Desarrollamos proyectos de ingeniería y automatización robustos y a la medida de tus desafíos.',
      imageSrc: '/proyecto1212.jpg',
      imageAlt: 'Proyectos Corpinveca',
      buttonText: 'Explorar Proyectos',
      linkHref: '/proyectos',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center text-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-background-modern.jpg"
            alt="Fondo Hero Section Corpinveca"
            fill
            className="object-cover"
            sizes="100vw"
            quality={85}
            priority
          />
        </div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-20 flex flex-col items-center justify-center p-8 max-w-3xl lg:max-w-4xl mx-auto">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-6 leading-tight text-white">
            Ingeniería Innovadora para la Industria del Mañana
          </h1>
          <p className="text-base md:text-lg lg:text-xl mb-8 max-w-2xl mx-auto">
            Desde la automatización hasta proyectos electromecánicos a medida. Creamos el futuro de
            tu producción, hoy.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              href="/servicios"
              className="btn btn-accent btn-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300 w-full sm:w-auto"
            >
              Ver Servicios
            </Link>
            <Link
              href="/productos"
              className="btn btn-primary btn-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300 w-full sm:w-auto"
            >
              Ver Productos
            </Link>
          </div>
        </div>
      </section>

      {/* Sección 2: Diferenciadores */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 text-center mb-12">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DifferentiatorItem
              imageSrc="/tarjeta01.jpeg"
              imageAlt="Experiencia en el sector industrial"
              title="Experiencia Comprobada"
              description="Más de 20 años de experiencia en el sector industrial, respaldados por un equipo altamente calificado y certificado."
            />
            <DifferentiatorItem
              imageSrc="/tarjeta02.jpeg"
              imageAlt="Soluciones personalizadas para la industria"
              title="Soluciones a Medida"
              description="Desarrollamos soluciones personalizadas que se adaptan a las necesidades específicas de cada cliente y proyecto."
            />
            <DifferentiatorItem
              imageSrc="/tarjeta03.jpeg"
              imageAlt="Tecnología de vanguardia en la industria"
              title="Tecnología de Vanguardia"
              description="Utilizamos las últimas tecnologías y metodologías para garantizar la eficiencia y calidad en cada proyecto."
            />
          </div>
        </div>
      </section>

      {/* Sección 3: Tarjetas de Llamada a la Acción */}
      <section className="py-16 sm:py-20 bg-slate-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary text-center mb-12">
            Explora Nuestras Soluciones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ctaCardsData.map((card, index) => (
              <CallToActionCard
                key={index}
                imageSrc={card.imageSrc}
                imageAlt={card.imageAlt}
                title={card.title}
                description={card.description}
                buttonText={card.buttonText}
                linkHref={card.linkHref}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
