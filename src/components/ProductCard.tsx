'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import AddToRequestButton from './AddToRequestButton';
import { ProductPost, Producto } from '@/services/wordpress';

interface ProductCardProps {
  producto: ProductPost | Producto;
  displayMode?: 'list' | 'detail';
  containerClassName?: string;
}

export default function ProductCard({
  producto,
  displayMode = 'list',
  containerClassName = '',
}: ProductCardProps) {
  const { id, title, slug, featuredImage, camposDeProducto, excerpt, content } = producto;

  // Estados para el HTML sanitizado
  const [sanitizedExcerpt, setSanitizedExcerpt] = useState('');
  const [sanitizedContent, setSanitizedContent] = useState('');

  useEffect(() => {
    // Asegurarse de que DOMPurify solo se ejecute en el cliente
    if (typeof window !== 'undefined') {
      setSanitizedExcerpt(DOMPurify.sanitize(excerpt || '', { USE_PROFILES: { html: true } }));
      setSanitizedContent(DOMPurify.sanitize(content || '', { USE_PROFILES: { html: true } }));
    }
  }, [excerpt, content]);

  const imageUrl = featuredImage?.node?.sourceUrl || '/placeholder-product-image.jpg';
  const price = camposDeProducto?.precio;
  const sku = camposDeProducto?.numeroDeParteSku;
  const baseUrl = 'productos';

  const itemDataForButton = {
    id: id,
    name: title,
    price: price,
    sku: sku || 'PRODUCTO',
    image: imageUrl,
    slug: slug,
  };

  const cardClasses = `card card-compact w-full bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 ${containerClassName}`;

  return (
    <div className={cardClasses}>
      <figure className="relative h-56 bg-gray-200">
        <Link href={`/${baseUrl}/${slug}`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={title}
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

      <div className="card-body p-4">
        <h2 className="card-title text-lg font-bold text-gray-900">
          <Link href={`/${baseUrl}/${slug}`} className="hover:text-accent transition-colors">
            {title}
          </Link>
        </h2>

        {displayMode === 'list' && sanitizedExcerpt && (
          <div
            className="text-sm text-gray-600 mt-1 mb-3 line-clamp-3 flex-grow"
            dangerouslySetInnerHTML={{ __html: sanitizedExcerpt }}
          />
        )}

        {displayMode === 'detail' && sanitizedContent && (
          <div
            className="text-sm text-gray-600 mt-1 mb-3 flex-grow"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        )}

        {price !== undefined && typeof price === 'number' && (
          <p className="text-xl font-semibold text-primary mb-2">
            {Number(price).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        )}

        {sku && <p className="text-xs text-gray-500 mb-3">SKU: {sku}</p>}

        <div className="card-actions justify-end items-center mt-auto pt-2 gap-2 flex-wrap">
          {displayMode === 'list' && (
            <Link href={`/${baseUrl}/${slug}`} className="btn btn-sm btn-outline btn-primary">
              Ver Detalles
            </Link>
          )}
          <AddToRequestButton item={itemDataForButton} className="btn-sm btn-accent" />
        </div>
      </div>
    </div>
  );
}
