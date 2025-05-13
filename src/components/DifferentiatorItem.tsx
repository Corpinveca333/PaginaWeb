import React from 'react';
import Image from 'next/image';

interface DifferentiatorItemProps {
  imageSrc: string; // Ruta a la imagen
  imageAlt: string; // Texto alternativo para la imagen
  title: string;
  description: string;
}

export default function DifferentiatorItem({
  imageSrc,
  imageAlt,
  title,
  description,
}: DifferentiatorItemProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1.5 h-full">
      <div className="relative w-full h-48">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-700 text-sm flex-grow">{description}</p>
      </div>
    </div>
  );
}
