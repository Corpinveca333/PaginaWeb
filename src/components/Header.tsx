'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useRequestList } from '@/context/RequestListContext';

interface MenuItem {
  label: string;
  path: string;
}

const defaultMenuItems: MenuItem[] = [
  { label: 'Inicio', path: '/' },
  { label: 'Productos', path: '/productos' },
  { label: 'Servicios', path: '/servicios' },
  { label: 'Proyectos', path: '/proyectos' },
  { label: 'Quiénes Somos', path: '/quienes-somos' },
];

// Modificar para apuntar directamente a la pantalla de login
const adminMenuItems: MenuItem[] = [{ label: 'ADMIN', path: '/admin' }];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [sticky, setSticky] = useState(false);
  const _pathname = usePathname();
  const { state } = useRequestList();
  const itemCount = state.items.length;

  const handleStickyNavbar = () => {
    if (window.scrollY >= 80) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleStickyNavbar);
    return () => {
      window.removeEventListener('scroll', handleStickyNavbar);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleAdminMenu = () => {
    setIsAdminMenuOpen(!isAdminMenuOpen);
  };

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors text-white hover:text-gray-300`}
      onClick={() => setIsMenuOpen(false)}
    >
      {label}
    </Link>
  );

  return (
    <header
      className={`bg-custom-rey text-white fixed top-0 left-0 w-full z-50 flex items-center justify-center transition-all duration-300 ${
        sticky ? 'shadow-md !py-4' : 'py-6'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image src="/logocor.jpg" alt="Corpinveca Logo" width={45} height={45} />
              <span className="ml-2 text-xl font-semibold text-white">Corpinveca</span>
            </Link>
          </div>

          {/* Menú de navegación para escritorio */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {defaultMenuItems.map(item => (
              <NavLink key={item.path} href={item.path} label={item.label} />
            ))}

            {/* Enlace directo a la página de admin sin desplegable */}
            <Link
              href="/admin"
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-white hover:text-gray-300"
            >
              ADMIN
            </Link>
          </nav>

          {/* Botones de acción, contador y Theme Toggle */}
          <div className="flex items-center space-x-4">
            {/* Contador de la Lista de Solicitud */}
            <Link href="/solicitud" className="relative text-white hover:text-gray-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-custom-naranja rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            <Link
              href="/contacto"
              className="btn bg-custom-naranja hover:bg-white hover:text-black border-custom-naranja hover:border-black text-white hidden md:inline-block btn-md"
            >
              Contacto
            </Link>

            {/* Botón de menú móvil */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="p-2 rounded-md text-white hover:text-gray-300 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded="false"
                title={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                <span className="sr-only">{isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
                {isMenuOpen ? (
                  <svg
                    className="h-6 w-6"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Panel de menú móvil */}
        {isMenuOpen && (
          <div
            id="mobile-menu"
            className="md:hidden absolute top-full left-0 w-full bg-royal-blue shadow-lg rounded-b-lg py-2"
          >
            <nav className="flex flex-col space-y-1 px-2">
              {defaultMenuItems.map(item => (
                <NavLink key={item.path} href={item.path} label={item.label} />
              ))}

              {/* Enlace a admin en móvil */}
              <div className="border-t border-gray-700 my-2 pt-2">
                <p className="px-3 py-1 text-xs font-semibold text-gray-400">Administración</p>
                {adminMenuItems.map(item => (
                  <NavLink key={item.path} href={item.path} label={item.label} />
                ))}
              </div>

              <Link
                href="/contacto"
                className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-orange bg-blue-700 hover:bg-orange"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
