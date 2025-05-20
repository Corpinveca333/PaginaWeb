'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { Servicio, ServicioListItem } from '@/services/supabase';
import AddToRequestButton from './AddToRequestButton';

interface ServiceCardProps {
  servicio: Servicio | ServicioListItem | null | undefined;
  displayMode?: 'list' | 'detail';
  containerClassName?: string;
}

export default function ServiceCard({
  servicio,
  displayMode = 'list',
  containerClassName = '',
}: ServiceCardProps) {
  // Estados para el HTML sanitizado
  const [sanitizedExcerpt, setSanitizedExcerpt] = useState('');
  const [sanitizedContent, setSanitizedContent] = useState('');
  const [sanitizedAlcance, setSanitizedAlcance] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && servicio) {
      if (displayMode === 'list') {
        setSanitizedExcerpt(
          DOMPurify.sanitize(servicio.excerpt || '', { USE_PROFILES: { html: true } })
        );
      } else {
        const content = (servicio as Servicio).content;
        const alcance = (servicio as Servicio).alcance_del_servicio;
        setSanitizedContent(DOMPurify.sanitize(content || '', { USE_PROFILES: { html: true } }));
        setSanitizedAlcance(DOMPurify.sanitize(alcance || '', { USE_PROFILES: { html: true } }));
      }
    }
  }, [servicio, displayMode]);

  if (!servicio) {
    return (
      <div
        className={`card card-compact w-full bg-custom-rey text-gray-200 shadow-xl ${containerClassName}`}
      >
        <div className="flex flex-col items-center justify-center p-4 min-h-[300px]">
          <p className="text-gray-300">Cargando servicio...</p>
        </div>
      </div>
    );
  }

  // Campos comunes
  const { id, title, slug, featured_image_url, icono_url, precio } = servicio;

  // Campos específicos del modo detalle
  // const content = // Eliminado, se usa servicio.content en useEffect
  //   displayMode === 'detail' && 'content' in servicio ? (servicio as Servicio).content : null;
  // const alcanceDelServicio = // Eliminado, se usa servicio.alcance_del_servicio en useEffect
  //   displayMode === 'detail' && 'alcance_del_servicio' in servicio
  //     ? (servicio as Servicio).alcance_del_servicio
  //     : null;

  const imageUrl = featured_image_url || '/placeholder-service-image.jpg';
  const baseUrl = 'servicios';

  const itemDataForButton = {
    id: id,
    name: title,
    price: precio,
    sku: `SERV-${id}`,
    slug: slug,
    image: icono_url || imageUrl,
  };

  const cardClasses = `card card-compact w-full bg-custom-rey text-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 h-full flex flex-col ${containerClassName}`;

  return (
    <div className={cardClasses}>
      <figure className="relative h-48 sm:h-56 bg-gray-700">
        <Link href={`/${baseUrl}/${slug}`} className="block w-full h-full">
          <Image
            src={icono_url || imageUrl}
            alt={title || 'Imagen del servicio'}
            fill
            className={
              icono_url && displayMode === 'detail'
                ? 'object-contain p-8'
                : icono_url
                  ? 'object-contain p-4'
                  : 'object-cover'
            }
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
        <div className="flex items-start justify-between mb-2">
          <h2 className="card-title text-lg font-bold text-white">
            <Link
              href={`/${baseUrl}/${slug}`}
              className="hover:text-custom-naranja transition-colors"
            >
              {title}
            </Link>
          </h2>

          {icono_url && icono_url !== imageUrl && displayMode === 'list' && (
            <div className="relative w-10 h-10 ml-3 flex-shrink-0">
              <Image
                src={icono_url}
                alt={`Icono de ${title}`}
                fill
                className="object-contain"
                sizes="40px"
              />
            </div>
          )}
        </div>

        {displayMode === 'list' && sanitizedExcerpt && (
          <div
            className="text-sm text-gray-300 mt-1 mb-3 line-clamp-3 prose prose-sm max-w-none prose-invert flex-grow"
            dangerouslySetInnerHTML={{ __html: sanitizedExcerpt }}
          />
        )}

        {displayMode === 'detail' && sanitizedContent && (
          <div
            className="text-sm text-gray-300 mt-1 mb-3 prose prose-sm max-w-none prose-invert flex-grow"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        )}

        {displayMode === 'detail' && sanitizedAlcance && (
          <div className="mt-2">
            <h4 className="text-sm font-semibold text-gray-100 mb-1">Alcance del Servicio:</h4>
            <div
              className="text-sm text-gray-300 prose prose-sm max-w-none prose-invert"
              dangerouslySetInnerHTML={{ __html: sanitizedAlcance }}
            />
          </div>
        )}

        {precio !== undefined && typeof precio === 'number' ? (
          <p className="text-xl font-semibold text-white my-3">
            {Number(precio).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        ) : (
          displayMode === 'detail' && (
            <p className="text-sm text-gray-400 my-3">Precio no disponible</p>
          )
        )}

        <div className="card-actions justify-end items-center mt-auto pt-3 space-x-4 flex-wrap">
          {displayMode === 'list' && (
            <Link
              href={`/${baseUrl}/${slug}`}
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
