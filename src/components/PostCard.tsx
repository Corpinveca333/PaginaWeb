'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import DOMPurify from 'dompurify';
import { UnifiedPost } from '@/types/wordpress';

interface PostCardProps {
  post: UnifiedPost;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
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

  return (
    <article className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 sm:h-64 w-full">
        <Image
          src={featuredImageUrl}
          alt={featuredImageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {post.category && (
          <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {post.category}
          </span>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <time dateTime={post.date}>{formattedDate}</time>
          <span className="mx-2">•</span>
          <span>Por {post.author?.name}</span>
        </div>

        <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
          <Link
            href={`/blog/${post.slug}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <span dangerouslySetInnerHTML={{ __html: sanitizedTitle }} />
          </Link>
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          <span dangerouslySetInnerHTML={{ __html: sanitizedExcerpt }} />
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {post.author?.avatar && (
              <div className="h-8 w-8 rounded-full overflow-hidden mr-3">
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={32}
                  height={32}
                  className="object-cover"
                  sizes="32px"
                />
              </div>
            )}
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
          >
            Leer más →
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
