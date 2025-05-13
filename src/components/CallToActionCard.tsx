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
    <div className="group flex flex-col sm:flex-row bg-sky-100 rounded-xl shadow-lg hover:shadow-2xl overflow-hidden transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-transparent hover:border-accent min-h-[200px] h-full">
      <div className="w-full sm:w-1/3 h-48 sm:h-full relative">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="w-full sm:w-2/3 p-5 flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-gray-700 text-sm mb-4">{description}</p>
        </div>
        <div className="mt-auto">
          <Link href={linkHref} className="btn btn-accent btn-sm md:btn-md self-start sm:self-auto">
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
}
