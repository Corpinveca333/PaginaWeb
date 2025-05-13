import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FooterProps {
  companyName?: string;
  logoSrc?: string;
  copyrightText?: string;
}

const Footer: React.FC<FooterProps> = ({
  companyName = 'Corpinveca',
  logoSrc = '/logo.svg',
  copyrightText = `© ${new Date().getFullYear()} ${companyName}. Todos los derechos reservados.`,
}) => {
  return (
    <>
      <footer className="footer p-10 bg-black text-gray-300">
        <aside>
          <Image
            src={logoSrc}
            alt={`${companyName} Logo`}
            width={150}
            height={40}
            className="h-10 w-auto"
          />
          <p className="font-semibold text-lg text-white mt-2">{companyName}</p>
          <p className="text-sm max-w-xs mt-1">
            Soluciones innovadoras para la industria del mañana.
          </p>
        </aside>
        <nav>
          <h6 className="footer-title text-white opacity-90">Navegación</h6>
          <Link href="/" className="link link-hover">
            Inicio
          </Link>
          <Link href="/productos" className="link link-hover">
            Productos
          </Link>
          <Link href="/servicios" className="link link-hover">
            Servicios
          </Link>
          <Link href="/proyectos" className="link link-hover">
            Proyectos
          </Link>
          <Link href="/quienes-somos" className="link link-hover">
            Quiénes Somos
          </Link>
        </nav>
        <nav>
          <h6 className="footer-title text-white opacity-90">Empresa</h6>
          <Link href="/contacto" className="link link-hover">
            Contacto
          </Link>
          <Link href="/politica-de-privacidad" className="link link-hover">
            Política de Privacidad
          </Link>
          <Link href="/terminos-de-servicio" className="link link-hover">
            Términos de Servicio
          </Link>
        </nav>
      </footer>
      <footer className="footer footer-center p-4 bg-black text-gray-400 border-t border-gray-700">
        <aside>
          <p>{copyrightText}</p>
        </aside>
      </footer>
    </>
  );
};

export default Footer;
