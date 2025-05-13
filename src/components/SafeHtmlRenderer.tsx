'use client';

import DOMPurify from 'dompurify';
import React, { useEffect, useState } from 'react';

interface SafeHtmlRendererProps {
  dirtyHtml: string | null | undefined;
  className?: string; // Para pasar clases al div contenedor
  as?: keyof JSX.IntrinsicElements; // Para renderizar como otro elemento (ej. 'article')
}

const SafeHtmlRenderer: React.FC<SafeHtmlRendererProps> = ({
  dirtyHtml,
  className,
  as: ElementType = 'div', // Por defecto es un div
}) => {
  const [sanitizedHtml, setSanitizedHtml] = useState<string | TrustedHTML>('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true); // Indica que el componente se ha montado en el cliente
  }, []);

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined' && dirtyHtml) {
      // Solo sanitiza y establece el HTML si estamos en el cliente y hay HTML para procesar
      setSanitizedHtml(
        DOMPurify.sanitize(dirtyHtml, {
          USE_PROFILES: { html: true }, // Asegura que se permitan etiquetas HTML comunes
        })
      );
    } else if (dirtyHtml === null || dirtyHtml === undefined) {
      setSanitizedHtml(''); // Limpia si el HTML es nulo o indefinido
    }
    // No sanitizar en el servidor (isMounted es false inicialmente)
  }, [dirtyHtml, isMounted]);

  if (!isMounted || !dirtyHtml) {
    // Durante SSR o si no hay HTML, no renderizar nada o un placeholder.
    // Esto evita mostrar el contenido no sanitizado brevemente y luego sanitizarlo (causando un FOUC o error de hidratación).
    // Si el contenido debe estar presente para SEO desde el SSR, esta estrategia debe reconsiderarse
    // o la sanitización debe ocurrir en el servidor (más complejo).
    // Para contenido secundario, esto suele ser aceptable.
    return <ElementType className={className}></ElementType>; // Renderiza el wrapper vacío
  }

  return <ElementType className={className} dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

export default SafeHtmlRenderer;
