import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Podríamos añadir iconos para redes sociales si es necesario
// import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const companyName = 'Corpinveca'; // Podría venir de props o una constante global

  return (
    <footer className="bg-custom-rey text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          {/* Columna del Logo y Descripción */}
          <div className="md:col-span-1 lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              {/* Usar el mismo logo que en el Header, o uno específico para el footer */}
              <Image src="/maquina.png" alt={`${companyName} Logo`} width={40} height={40} />
              <span className="ml-2 text-xl font-semibold text-white">{companyName}</span>
            </Link>
            <p className="text-gray-200 text-sm max-w-xs">
              Soluciones innovadoras para la industria del mañana.
            </p>
            {/* Espacio para iconos de redes sociales si se añaden */}
            {/* <div className="flex space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-primary"><FaFacebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary"><FaTwitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary"><FaInstagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-primary"><FaLinkedin size={20} /></a>
            </div> */}
          </div>

          {/* Columna de Navegación */}
          <div>
            <h6 className="font-semibold text-white mb-4">Navegación</h6>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-sm text-gray-200 hover:text-white">
                Inicio
              </Link>
              <Link href="/productos" className="text-sm text-gray-200 hover:text-white">
                Productos
              </Link>
              <Link href="/servicios" className="text-sm text-gray-200 hover:text-white">
                Servicios
              </Link>
              <Link href="/proyectos" className="text-sm text-gray-200 hover:text-white">
                Proyectos
              </Link>
              <Link href="/quienes-somos" className="text-sm text-gray-200 hover:text-white">
                Quiénes Somos
              </Link>
            </nav>
          </div>

          {/* Columna de Empresa/Legal */}
          <div>
            <h6 className="font-semibold text-white mb-4">Empresa</h6>
            <nav className="flex flex-col space-y-2">
              <Link href="/contacto" className="text-sm text-gray-200 hover:text-white">
                Contacto
              </Link>
              <Link
                href="/politica-de-privacidad"
                className="text-sm text-gray-200 hover:text-white"
              >
                Política de Privacidad
              </Link>
              <Link href="/terminos-de-servicio" className="text-sm text-gray-200 hover:text-white">
                Términos de Servicio
              </Link>
            </nav>
          </div>
        </div>

        {/* Barra de Copyright Inferior */}
        <div className="border-t border-gray-400 pt-8 text-center">
          <p className="text-sm text-gray-200">
            © {currentYear} {companyName}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
