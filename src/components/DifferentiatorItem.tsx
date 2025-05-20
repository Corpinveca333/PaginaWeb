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
    <div className="card card-compact w-full bg-custom-rey text-gray-200 shadow-xl hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 group h-full flex flex-col">
      <div className="relative w-full h-48 bg-gray-700">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="card-title text-lg font-bold text-white mb-2 group-hover:text-orange-300 transition-colors duration-300">
          {title}
        </h3>
        <p className="text-gray-200 text-sm flex-grow">{description}</p>
      </div>
    </div>
  );
}
