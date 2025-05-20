'use client';

import Image from 'next/image';
import React from 'react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role?: string;
  avatarUrl: string;
}

export default function TestimonialCard({ quote, name, role, avatarUrl }: TestimonialCardProps) {
  return (
    <div className="card card-compact bg-custom-rey text-gray-200 shadow-xl h-full flex flex-col p-6 md:p-8 items-center text-center">
      {/* Avatar */}
      <div className="avatar mb-4 flex justify-center items-center">
        <div className="w-20 h-20 bg-custom-naranja text-neutral-content rounded-full ring ring-offset-custom-rey ring-offset-2 flex items-center justify-center overflow-hidden">
          <Image
            src={avatarUrl}
            alt={`Foto de ${name}`}
            width={80}
            height={80}
            className="rounded-full object-cover w-20 h-20"
          />
        </div>
      </div>

      {/* Cuerpo del Testimonio */}
      <div className="flex-grow flex flex-col justify-center">
        <p className="text-md italic text-white mb-5 leading-relaxed">&quot;{quote}&quot;</p>
      </div>
      <div>
        <h4 className="font-semibold text-white text-md">{name}</h4>
        {role && <p className="text-sm text-gray-400">{role}</p>}
      </div>
    </div>
  );
}
