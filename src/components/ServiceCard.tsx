'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { Servicio, ServicioListItem } from '@/services/supabase';
import AddToRequestButton from './AddToRequestButton';
import { normalizeDriveUrl } from '@/lib/imageUtils';
import { getOptimizedImageUrl } from '@/lib/supabaseImageUtils';

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
  const [imageError, setImageError] = useState(false);
  const [iconError, setIconError] = useState(false);

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

  // Verificar si las URLs son de Supabase o tienen el formato antiguo
  // Si provienen de Supabase, las usamos directamente
  const isSupabaseImage = featured_image_url && featured_image_url.includes('supabase.co');
  const isSupabaseIcon = icono_url && icono_url.includes('supabase.co');

  // Determinar la fuente de la imagen principal
  let imageUrl = '';
  if (isSupabaseImage) {
    // Imagen de Supabase - usar directamente
    imageUrl = featured_image_url || '';
  } else if (featured_image_url && featured_image_url.includes('drive.google.com')) {
    // Imagen de Google Drive - usar miniatura
    const driveId =
      featured_image_url.match(/id=([^&]+)/) || featured_image_url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (driveId && driveId[1]) {
      imageUrl = `https://drive.google.com/thumbnail?id=${driveId[1]}&sz=w1000`;
    } else {
      imageUrl = '/placeholder-image.svg';
    }
  } else if (featured_image_url && featured_image_url.startsWith('/')) {
    // Imagen local
    imageUrl = featured_image_url;
  } else {
    // Fallback
    imageUrl = '/placeholder-image.svg';
  }

  // Determinar la fuente del icono
  let iconUrl = '';
  if (isSupabaseIcon) {
    // Icono de Supabase - usar directamente
    iconUrl = icono_url || '';
  } else if (icono_url && icono_url.includes('drive.google.com')) {
    // Icono de Google Drive - usar miniatura
    const driveId = icono_url.match(/id=([^&]+)/) || icono_url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (driveId && driveId[1]) {
      iconUrl = `https://drive.google.com/thumbnail?id=${driveId[1]}&sz=w400`;
    } else {
      iconUrl = '';
    }
  } else if (icono_url && icono_url.startsWith('/')) {
    // Icono local
    iconUrl = icono_url;
  } else {
    // Sin icono
    iconUrl = '';
  }

  const baseUrl = 'servicios';

  // Para el botón, si no hay imagen, usar string vacío
  const itemDataForButton = {
    id: id,
    name: title,
    price: precio,
    sku: `SERV-${id}`,
    slug: slug,
    image:
      iconUrl && !iconError
        ? iconUrl
        : imageUrl && !imageError
          ? imageUrl
          : '/placeholder-image.svg',
  };

  const cardClasses = `card card-compact w-full bg-custom-rey text-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 h-full flex flex-col ${containerClassName}`;

  // Manejar errores de carga de imagen
  const handleImageError = () => {
    console.error('Error al cargar la imagen principal:', imageUrl);
    setImageError(true);
  };

  // Manejar errores de carga de icono
  const handleIconError = () => {
    console.error('Error al cargar el icono:', iconUrl);
    setIconError(true);
  };

  return (
    <div className={cardClasses}>
      <figure className="relative h-48 sm:h-56 bg-gray-700">
        <Link href={`/${baseUrl}/${slug}`} className="block w-full h-full">
          {imageError ? (
            <div className="flex items-center justify-center w-full h-full bg-gray-700 text-center p-4">
              <span className="text-gray-400">Imagen no disponible</span>
            </div>
          ) : (
            <Image
              src={imageUrl}
              alt={title || 'Imagen del servicio'}
              fill
              className={
                iconUrl && !iconError && displayMode === 'detail'
                  ? 'object-contain p-8'
                  : iconUrl && !iconError
                    ? 'object-contain p-4'
                    : 'object-cover'
              }
              sizes={
                displayMode === 'detail'
                  ? '(max-width: 640px) 90vw, 360px'
                  : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
              }
              priority={displayMode === 'detail'}
              unoptimized={true}
              onError={handleImageError}
            />
          )}
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

          {iconUrl && !iconError && iconUrl !== imageUrl && displayMode === 'list' && (
            <div className="relative w-10 h-10 ml-3 flex-shrink-0">
              <Image
                src={iconUrl}
                alt={`Icono de ${title}`}
                fill
                className="object-contain"
                sizes="40px"
                unoptimized={true}
                onError={handleIconError}
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
