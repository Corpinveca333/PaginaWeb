'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import AddToRequestButton from './AddToRequestButton';
import { Servicio } from '@/services/wordpress';

interface ServiceCardProps {
  servicio: Servicio;
  displayMode?: 'list' | 'detail';
  containerClassName?: string;
}

export default function ServiceCard({
  servicio,
  displayMode = 'list',
  containerClassName = '',
}: ServiceCardProps) {
  const { id, title, slug, excerpt, content, featuredImage, camposDeServicio } = servicio;

  // Estados para el HTML sanitizado
  const [sanitizedExcerpt, setSanitizedExcerpt] = useState('');
  const [sanitizedContent, setSanitizedContent] = useState('');
  const [sanitizedAlcance, setSanitizedAlcance] = useState('');

  useEffect(() => {
    // Asegurarse de que DOMPurify solo se ejecute en el cliente
    if (typeof window !== 'undefined') {
      setSanitizedExcerpt(DOMPurify.sanitize(excerpt || '', { USE_PROFILES: { html: true } }));
      setSanitizedContent(DOMPurify.sanitize(content || '', { USE_PROFILES: { html: true } }));
      setSanitizedAlcance(
        DOMPurify.sanitize(camposDeServicio?.alcanceDelServicio || '', {
          USE_PROFILES: { html: true },
        })
      );
    }
  }, [excerpt, content, camposDeServicio?.alcanceDelServicio]);

  const imageUrl = featuredImage?.node?.sourceUrl || '/placeholder-service-image.jpg';
  const precio = camposDeServicio?.precio;
  const iconoUrl = camposDeServicio?.iconoDelServicio?.node?.sourceUrl;
  const iconoAlt = camposDeServicio?.iconoDelServicio?.node?.altText;

  const baseUrl = 'servicios';

  const itemDataForButton = {
    id: id,
    name: title,
    price: precio,
    sku: `SERV-${id}`,
    slug: slug,
  };

  const cardClasses = `card card-compact w-full bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 ${containerClassName}`;

  return (
    <div className={cardClasses}>
      <figure className="relative h-56 bg-gray-700">
        <Link href={`/${baseUrl}/${slug}`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={featuredImage?.node?.altText || title}
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
        <div className="flex items-center justify-between">
          <h2 className="card-title text-lg font-bold text-gray-100">
            <Link href={`/${baseUrl}/${slug}`} className="hover:text-accent transition-colors">
              {title}
            </Link>
          </h2>

          {iconoUrl && (
            <div className="relative w-8 h-8">
              <Image
                src={iconoUrl}
                alt={iconoAlt || `Icono de ${title}`}
                fill
                className="object-contain"
                sizes="32px"
              />
            </div>
          )}
        </div>

        {displayMode === 'list' && sanitizedExcerpt && (
          <div
            className="text-sm text-gray-300 mt-1 mb-3 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: sanitizedExcerpt }}
          />
        )}

        {displayMode === 'detail' && sanitizedContent && (
          <div
            className="text-sm text-gray-300 mt-1 mb-3 prose prose-sm max-w-none prose-invert"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        )}

        {displayMode === 'detail' && sanitizedAlcance && (
          <div className="mt-2">
            <h4 className="text-xs font-semibold text-gray-200 mb-1">Alcance del Servicio:</h4>
            <div
              className="text-xs text-gray-400 prose prose-sm max-w-none prose-invert"
              dangerouslySetInnerHTML={{ __html: sanitizedAlcance }}
            />
          </div>
        )}

        {precio !== undefined && precio !== null && (
          <p className="text-xl font-semibold text-accent my-2">
            {Number(precio).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        )}

        <div className="card-actions justify-end items-center mt-auto pt-4 gap-2 flex-wrap">
          {displayMode === 'list' && (
            <Link href={`/${baseUrl}/${slug}`} className="btn btn-sm btn-outline btn-accent">
              Ver Detalles
            </Link>
          )}
          <AddToRequestButton item={itemDataForButton} className="btn-sm btn-accent" />
        </div>
      </div>
    </div>
  );
}
