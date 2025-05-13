'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { ProyectoNode } from '@/services/wordpress';

interface ProjectCardProps {
  proyecto: ProyectoNode;
  displayMode?: 'list' | 'detail';
  containerClassName?: string;
}

export default function ProjectCard({
  proyecto,
  displayMode = 'list',
  containerClassName = '',
}: ProjectCardProps) {
  const { id, title, slug, date, excerpt, content, featuredImage, camposDeProyecto } = proyecto;
  const cliente = camposDeProyecto?.cliente;
  const fechaDeRealizacion = camposDeProyecto?.fechaDeRealizacion;
  const detallesAlcanceOriginal = camposDeProyecto?.detallesalcanceDelProyecto;
  const imagenAdicional = camposDeProyecto?.galeriaDeImagenes;

  // Estados para el HTML sanitizado
  const [sanitizedExcerpt, setSanitizedExcerpt] = useState('');
  const [sanitizedContent, setSanitizedContent] = useState('');
  const [sanitizedDetallesAlcance, setSanitizedDetallesAlcance] = useState('');

  useEffect(() => {
    // Asegurarse de que DOMPurify solo se ejecute en el cliente
    if (typeof window !== 'undefined') {
      setSanitizedExcerpt(DOMPurify.sanitize(excerpt || '', { USE_PROFILES: { html: true } }));
      setSanitizedContent(DOMPurify.sanitize(content || '', { USE_PROFILES: { html: true } }));
      setSanitizedDetallesAlcance(
        DOMPurify.sanitize(detallesAlcanceOriginal || '', { USE_PROFILES: { html: true } })
      );
    }
  }, [excerpt, content, detallesAlcanceOriginal]);

  const imageUrl = featuredImage?.node?.sourceUrl || '/placeholder-project-image.jpg';
  const baseUrl = 'proyectos';

  const fechaFormateada = fechaDeRealizacion
    ? new Date(fechaDeRealizacion).toLocaleDateString('es-CL', {
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
          <div
            className="text-sm text-gray-300 mt-1 mb-3 prose prose-sm max-w-none prose-invert"
            dangerouslySetInnerHTML={{ __html: sanitizedDetallesAlcance }}
          />
        )}

        {cliente && (
          <p className="text-xs text-gray-400 mb-1">
            <span className="font-semibold">Cliente:</span> {cliente}
          </p>
        )}

        {fechaFormateada && (
          <p className="text-xs text-gray-400 mb-3">
            <span className="font-semibold">Fecha:</span> {fechaFormateada}
          </p>
        )}

        {displayMode === 'detail' && imagenAdicional?.node?.sourceUrl && (
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-200 mb-2">Imagen Adicional:</h3>
            <div className="relative aspect-video w-full">
              <Image
                src={imagenAdicional.node.sourceUrl}
                alt={imagenAdicional.node.altText || 'Imagen adicional del proyecto'}
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
