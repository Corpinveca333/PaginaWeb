'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchInput({
  placeholder = 'Buscar...',
  className = '',
}: {
  placeholder?: string;
  className?: string;
}) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname(); // Importar usePathname

  // Obtener el valor inicial del parámetro 'search' de la URL
  const initialSearchTerm = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  // Efecto para sincronizar el estado local con el parámetro de URL si este cambia (por navegación, etc.)
  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  // Función con debounce para actualizar la URL y prevenir demasiadas peticiones
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300); // Espera 300ms después de que el usuario deja de escribir

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value); // Llamar a la función con debounce
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={searchTerm}
      onChange={handleInputChange}
      className={`px-4 py-2 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-primary focus:border-primary ${className}`}
    />
  );
}

import { usePathname } from 'next/navigation'; // Asegurar la importación de usePathname
