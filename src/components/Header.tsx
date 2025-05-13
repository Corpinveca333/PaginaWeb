'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useRequestList } from '@/context/RequestListContext';

interface MenuItem {
  label: string;
  path: string;
  children?: MenuItem[];
}

interface HeaderProps {
  menuItems?: MenuItem[];
  logoSrc?: string;
  logoAlt?: string;
}

const defaultMenuItems: MenuItem[] = [
  { label: 'Inicio', path: '/' },
  { label: 'Productos', path: '/productos' },
  { label: 'Servicios', path: '/servicios' },
  { label: 'Proyectos', path: '/proyectos' },
  { label: 'Quiénes Somos', path: '/quienes-somos' },
  { label: 'Contacto', path: '/contacto' },
];

const Header: React.FC<HeaderProps> = ({
  menuItems = defaultMenuItems,
  logoSrc = '/logo.svg',
  logoAlt = 'Corpinveca Logo',
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { state } = useRequestList();
  const itemCount = state.items.length;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[80px] text-white bg-black shadow-md">
      <div className="container mx-auto h-full flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo estático */}
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image src="/maquina.png" alt="Corpinveca Logo" width={55} height={55} />
          </Link>
        </div>

        {/* Menú de navegación para escritorio */}
        <nav className="hidden md:flex space-x-1 lg:space-x-2">
          {menuItems.map(item => (
            <Link
              key={item.path}
              href={item.path}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === item.path
                  ? 'text-accent bg-gray-900'
                  : 'text-white hover:bg-gray-900 hover:text-accent'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Botones de acción y contador de solicitud */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/contacto" className="btn btn-accent btn-sm md:btn-md">
            Contacto
          </Link>
          {/* Contador de la Lista de Solicitud */}
          <div className="relative ml-2">
            <Link href="/solicitud" className="flex items-center text-white hover:text-gray-300">
              {/* Icono de lista/solicitud */}
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
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Menú móvil */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-accent focus:outline-none"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only">Abrir menú principal</span>
            {/* Iconos del menú */}
            {isMenuOpen ? (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Panel de menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 shadow-lg" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map(item => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.path
                    ? 'text-accent bg-gray-800'
                    : 'text-white hover:bg-gray-800 hover:text-accent'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {/* Icono de Lista de Solicitud en menú móvil */}
            <Link
              href="/solicitud"
              className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gray-800 hover:text-accent group"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center space-x-2">
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
                <span>Mi Lista</span>
                {itemCount > 0 && (
                  <span className="bg-accent text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center ml-1">
                    {itemCount}
                  </span>
                )}
              </div>
            </Link>
            <Link
              href="/contacto"
              className="btn btn-accent btn-sm w-full mt-4"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
