'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { Proyecto, ProyectoListItem } from '@/services/supabase';

interface ProjectCardProps {
  proyecto: Proyecto | ProyectoListItem | null | undefined;
  displayMode?: 'list' | 'detail';
  containerClassName?: string;
}

export default function ProjectCard({
  proyecto,
  displayMode = 'list',
  containerClassName = '',
}: ProjectCardProps) {
  // Estados para el HTML sanitizado
  const [sanitizedExcerpt, setSanitizedExcerpt] = useState('');
  const [sanitizedContent, setSanitizedContent] = useState('');
  const [sanitizedDetallesAlcance, setSanitizedDetallesAlcance] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && proyecto) {
      if (displayMode === 'list') {
        setSanitizedExcerpt(
          DOMPurify.sanitize(proyecto.excerpt || '', { USE_PROFILES: { html: true } })
        );
      } else {
        const content = (proyecto as Proyecto).content;
        const detallesAlcance = (proyecto as Proyecto).detalles_alcance;
        setSanitizedContent(DOMPurify.sanitize(content || '', { USE_PROFILES: { html: true } }));
        setSanitizedDetallesAlcance(
          DOMPurify.sanitize(detallesAlcance || '', { USE_PROFILES: { html: true } })
        );
      }
    }
  }, [proyecto, displayMode]);

  if (!proyecto) {
    return (
      <div className={`card card-compact w-full bg-base-100 shadow-xl ${containerClassName}`}>
        <div className="flex flex-col items-center justify-center p-4 min-h-[300px]">
          <p className="text-gray-500">Cargando proyecto...</p>
        </div>
      </div>
    );
  }

  // Campos comunes
  const {
    /* id, */ title,
    slug,
    /* excerpt, */ featured_image_url,
    cliente,
    fecha_de_realizacion,
  } = proyecto;
  const _id = proyecto.id; // Renombrado y asignado si es necesario en otro lugar, sino eliminar

  // Campos específicos del modo detalle
  // const content = // Eliminado, se usa proyecto.content en useEffect
  //   displayMode === 'detail' && 'content' in proyecto ? (proyecto as Proyecto).content : null;
  // const detallesAlcanceOriginal = // Eliminado, se usa proyecto.detalles_alcance en useEffect
  //   displayMode === 'detail' && 'detalles_alcance' in proyecto
  //     ? (proyecto as Proyecto).detalles_alcance
  //     : null;
  const imagenAdicionalUrl =
    displayMode === 'detail' && 'imagen_adicional_url' in proyecto
      ? (proyecto as Proyecto).imagen_adicional_url
      : null;

  const imageUrl = featured_image_url || '/placeholder-project-image.jpg';
  const baseUrl = 'proyectos';

  const fechaFormateada = fecha_de_realizacion
    ? new Date(fecha_de_realizacion).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const cardClasses = `card card-compact w-full bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 ${containerClassName}`;

  return (
    <div className={cardClasses}>
      <figure className="relative h-56 bg-gray-700">
        <Link href={`/${baseUrl}/${slug}`} className="block w-full h-full">
          <Image
            src={imageUrl}
            alt={title || 'Imagen del proyecto'}
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
        <h2 className="card-title text-lg font-bold text-gray-100">
          <Link href={`/${baseUrl}/${slug}`} className="hover:text-accent transition-colors">
            {title}
          </Link>
        </h2>

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

        {displayMode === 'detail' && sanitizedDetallesAlcance && (
          <div className="mt-2">
            <h4 className="text-xs font-semibold text-gray-200 mb-1">Detalles del Alcance:</h4>
            <div
              className="text-sm text-gray-300 prose prose-sm max-w-none prose-invert"
              dangerouslySetInnerHTML={{ __html: sanitizedDetallesAlcance }}
            />
          </div>
        )}

        {cliente && (
          <p className="text-xs text-gray-400 mt-2 mb-1">
            <span className="font-semibold">Cliente:</span> {cliente}
          </p>
        )}

        {fechaFormateada && (
          <p className="text-xs text-gray-400 mb-3">
            <span className="font-semibold">Fecha:</span> {fechaFormateada}
          </p>
        )}

        {displayMode === 'detail' && imagenAdicionalUrl && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-200 mb-2">Imagen Adicional:</h3>
            <div className="relative aspect-video w-full">
              <Image
                src={imagenAdicionalUrl}
                alt={`Imagen adicional de ${title || 'proyecto'}`}
                fill
                className="object-cover rounded"
                sizes="(max-width: 640px) 90vw, 360px"
              />
            </div>
          </div>
        )}

        <div className="card-actions justify-end mt-auto pt-4">
          {displayMode === 'list' && (
            <Link href={`/${baseUrl}/${slug}`} className="btn btn-sm btn-outline btn-accent">
              Ver Detalles
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
