'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { UnifiedPost } from '@/types/wordpress';

interface PostCardProps {
  post: UnifiedPost;
  postType?: string;
  displayMode?: string;
}

export default function PostCard({
  post,
  postType = 'proyectos',
  displayMode = 'grid',
}: PostCardProps) {
  // Extraer título y excerpt de forma segura
  const postTitle =
    typeof post.title === 'string' ? post.title : post.title?.rendered || 'Sin título';

  const postExcerptHtml =
    typeof post.excerpt === 'string' ? post.excerpt : post.excerpt?.rendered || '';

  // Estados para el HTML sanitizado
  const [sanitizedTitle, setSanitizedTitle] = useState('');
  const [sanitizedExcerpt, setSanitizedExcerpt] = useState('');

  useEffect(() => {
    // Asegurarse de que DOMPurify solo se ejecute en el cliente
    if (typeof window !== 'undefined') {
      setSanitizedTitle(DOMPurify.sanitize(postTitle, { USE_PROFILES: { html: true } }));
      setSanitizedExcerpt(DOMPurify.sanitize(postExcerptHtml, { USE_PROFILES: { html: true } }));
    }
  }, [postTitle, postExcerptHtml]);

  // Formatear la fecha
  const formattedDate = new Date(post.date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Extraer la imagen destacada de cualquiera de los dos formatos posibles
  let featuredImageUrl = '';
  let featuredImageAlt = '';

  if (post.featuredImage) {
    // Formato GraphQL
    if ('node' in post.featuredImage && post.featuredImage.node) {
      featuredImageUrl = post.featuredImage.node.sourceUrl;
      featuredImageAlt = post.featuredImage.node.altText || postTitle;
    }
    // Formato REST API
    else if ('sourceUrl' in post.featuredImage) {
      featuredImageUrl = post.featuredImage.sourceUrl || '';
      featuredImageAlt = post.featuredImage.altText || postTitle;
    }
  }
  // Soporte para el formato anterior REST API con _embedded
  else if (post._embedded?.['wp:featuredmedia']?.[0]) {
    featuredImageUrl = post._embedded['wp:featuredmedia'][0].source_url;
    featuredImageAlt = post._embedded['wp:featuredmedia'][0].alt_text || postTitle;
  }

  const linkPath = `/blog/${post.slug}`;

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      {post.featured_image_url && (
        <Link href={linkPath} className="block relative w-full h-52 group">
          <Image
            src={post.featured_image_url}
            alt={post.title || `Imagen de ${postType}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>
      )}
      <div className="p-5 flex flex-col flex-grow">
        <h3
          className="font-semibold text-lg md:text-xl text-dark mb-2 truncate"
          title={post.title || 'Título no disponible'}
        >
          <Link href={linkPath} className="hover:text-primary transition-colors">
            {post.title || `Título de ${postType}`}
          </Link>
        </h3>
        {post.excerpt && (
          <div
            className="text-body-color text-sm mb-4 flex-grow overflow-hidden line-clamp-3 prose prose-sm max-w-none prose-invert"
            dangerouslySetInnerHTML={{ __html: sanitizedExcerpt }}
          />
        )}
        <div className="mt-auto pt-2">
          <Link
            href={linkPath}
            className="btn bg-custom-naranja text-white border-transparent hover:bg-white hover:text-black hover:border-black btn-sm"
          >
            {postType === 'proyectos' ? 'Ver Proyecto' : 'Leer Más'}
          </Link>
        </div>
      </div>
    </article>
  );
}
