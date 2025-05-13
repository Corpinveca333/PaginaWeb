"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  imageSrc: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  ctaText = "Ver Servicios",
  ctaLink = "/servicios",
  imageSrc = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
}) => {
  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      {/* 1. Imagen de fondo (capa inferior, z-0 implícito) */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={imageSrc}
          alt="Industria Venezolana"
          fill
          priority
          className="object-cover"
        />
        {/* 2. Overlay oscuro gradiente (sobre la imagen, z-10) */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70 z-10"></div>
      </div>
      
      {/* 3. Contenido (sobre el overlay, z-20) */}
      <div className="container relative z-20 mx-auto px-4 sm:px-6 py-24 flex flex-col justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="mb-3">
            <span className="inline-block py-1 px-3 text-xs font-semibold text-blue-100 bg-blue-600/30 rounded-full">
              CORPINVECA
            </span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-white">
            {title}
          </h1>
          
          <p className="text-xl text-blue-100/90 mb-8 max-w-lg">
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                href={ctaLink}
                className="relative inline-flex items-center justify-center px-8 py-3.5 overflow-hidden font-medium rounded-lg group bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl"
              >
                <span className="relative">{ctaText}</span>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link 
                href="/contacto" 
                className="relative inline-flex items-center justify-center px-8 py-3.5 overflow-hidden text-blue-300 border border-blue-300/40 font-medium rounded-lg hover:text-white group hover:bg-blue-600/20 transition-all duration-300"
              >
                <span className="relative">Contáctanos</span>
              </Link>
            </motion.div>
          </div>
          
          <div className="mt-12 flex items-center">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-white overflow-hidden">
                  <Image
                    src={`https://randomuser.me/api/portraits/men/${20 + i}.jpg`}
                    alt={`Cliente ${i}`}
                    width={20}
                    height={20}
                  />
                </div>
              ))}
            </div>
            <div className="ml-4 text-sm text-blue-200">
              <span className="font-semibold">+100 clientes</span> confían en nosotros
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection; 