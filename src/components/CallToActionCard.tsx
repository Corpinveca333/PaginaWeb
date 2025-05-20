import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CallToActionCardProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  buttonText: string;
  linkHref: string;
}

export default function CallToActionCard({
  imageSrc,
  imageAlt,
  title,
  description,
  buttonText,
  linkHref,
}: CallToActionCardProps) {
  return (
    <div className="card card-compact w-full bg-custom-rey text-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 group h-full flex flex-col">
      <figure className="relative w-full h-48 bg-gray-700">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </figure>
      <div className="card-body p-4 flex flex-col flex-grow">
        <h3 className="card-title text-xl font-bold text-white mb-3">{title}</h3>
        <p className="text-gray-200 text-sm mb-4 flex-grow">{description}</p>
        <Link
          href={linkHref}
          className="btn bg-custom-naranja text-white border-transparent hover:bg-white hover:text-black hover:border-black btn-sm mt-auto w-full sm:w-auto"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}
