'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import AddToRequestButton from './AddToRequestButton';
import { Producto } from '@/services/supabase';

interface ProductCardProps {
  producto: Producto | null | undefined;
  displayMode?: 'list' | 'detail';
  containerClassName?: string;
}

export default function ProductCard({
  producto,
  displayMode = 'list',
  containerClassName = '',
}: ProductCardProps) {
  // Estados para el HTML sanitizado (deben estar fuera de cualquier condición)
  const [sanitizedExcerpt, setSanitizedExcerpt] = useState('');
  const [sanitizedContent, setSanitizedContent] = useState('');

  // Desestructuración segura
  const id = producto?.id;
  const title = producto?.title;
  const slug = producto?.slug;
  const excerpt = producto?.excerpt;
  const content = producto?.content;
  const featured_image_url = producto?.featured_image_url;
  const precio = producto?.precio;
  const sku = producto?.sku;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSanitizedExcerpt(DOMPurify.sanitize(excerpt || '', { USE_PROFILES: { html: true } }));
      setSanitizedContent(DOMPurify.sanitize(content || '', { USE_PROFILES: { html: true } }));
    }
  }, [excerpt, content]);

  const imageUrl = featured_image_url || '/placeholder-product-image.jpg';
  const baseUrl = 'productos';

  const itemDataForButton = {
    id: id!,
    name: title || 'Producto sin nombre',
    price: typeof precio === 'number' ? precio : undefined,
    sku: sku || `PROD-${id!}`,
    image: imageUrl,
    slug: slug || '',
  };

  const cardClasses = `card card-compact w-full bg-custom-rey text-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 h-full flex flex-col ${containerClassName}`;

  if (!producto) {
    return (
      <div className={`card card-compact w-full bg-base-100 shadow-xl ${containerClassName}`}>
        <p className="text-gray-500">Información del producto no disponible.</p>
      </div>
    );
  }

  return (
    <div className={cardClasses}>
      <figure className="relative h-48 sm:h-56 bg-gray-700">
        <Link href={slug ? `/${baseUrl}/${slug}` : '#'} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={title || 'Imagen del producto'}
            fill
            className="object-cover"
            sizes={
              displayMode === 'detail'
                ? '(max-width: 640px) 90vw, 360px'
                : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
            }
            priority={displayMode === 'detail'}
          />
        </Link>
      </figure>

      <div className="card-body p-4 flex flex-col flex-grow">
        <h2 className="card-title text-lg font-bold text-white">
          <Link
            href={slug ? `/${baseUrl}/${slug}` : '#'}
            className="hover:text-custom-naranja transition-colors"
          >
            {title || 'Producto sin nombre'}
          </Link>
        </h2>

        {displayMode === 'list' && sanitizedExcerpt && (
          <div
            className="text-sm text-gray-300 mt-1 mb-3 line-clamp-3 prose prose-sm max-w-none prose-invert flex-grow"
            dangerouslySetInnerHTML={{
              __html: sanitizedExcerpt || '<p>Descripción no disponible.</p>',
            }}
          />
        )}

        {displayMode === 'detail' && sanitizedContent && (
          <div
            className="text-sm text-gray-300 mt-1 mb-3 prose prose-sm max-w-none prose-invert flex-grow"
            dangerouslySetInnerHTML={{
              __html: sanitizedContent || '<p>Contenido detallado no disponible.</p>',
            }}
          />
        )}

        {typeof precio === 'number' ? (
          <p className="text-xl font-semibold text-white my-2">
            {Number(precio).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        ) : (
          <p className="text-sm text-gray-400 mb-2">Precio no disponible</p>
        )}

        {sku ? (
          <p className="text-xs text-gray-400 mb-3">SKU: {sku}</p>
        ) : (
          <p className="text-xs text-gray-400 mb-3">SKU: N/A</p>
        )}

        <div className="card-actions justify-end items-center mt-auto pt-2 flex flex-wrap space-x-6">
          {displayMode === 'list' && (
            <Link
              href={slug ? `/${baseUrl}/${slug}` : '#'}
              className="btn bg-custom-naranja text-white border-transparent hover:bg-white hover:text-black hover:border-black text-xs px-3 py-1.5"
              style={{ fontSize: '0.85rem' }}
            >
              Ver Detalles
            </Link>
          )}
          <AddToRequestButton
            item={itemDataForButton}
            className="text-xs px-3 py-1.5 bg-custom-naranja text-white border-transparent hover:bg-white hover:text-black hover:border-black"
          />
        </div>
      </div>
    </div>
  );
}
