'use client';

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
  ctaText = 'Ver Servicios',
  ctaLink = '/servicios',
  imageSrc = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
}) => {
  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-white flex items-center">
      {/* Imagen de fondo eliminada para fondo blanco */}
      <div className="container relative z-20 mx-auto px-4 sm:px-6 py-24 flex flex-col justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="mb-3">
            <span className="inline-block py-1 px-3 text-xs font-semibold text-white bg-orange rounded-full">
              CORPINVECA
            </span>
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6 text-black drop-shadow-[0_2px_2px_rgba(255,255,255,1)]"
            style={{ WebkitTextStroke: '2px #fff' }}
          >
            {title}
          </h1>

          <p
            className="text-xl text-black mb-8 max-w-lg drop-shadow-[0_1px_1px_rgba(255,255,255,1)]"
            style={{ WebkitTextStroke: '1px #fff' }}
          >
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
                className="px-8 py-4 text-lg font-semibold rounded-md bg-orange text-white border-2 border-white shadow-md hover:bg-orange hover:shadow-xl transition-all duration-300"
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
                className="px-8 py-4 text-lg font-semibold rounded-md bg-white text-orange border-2 border-orange shadow-md hover:bg-orange hover:text-white hover:shadow-xl transition-all duration-300"
              >
                <span className="relative">Contáctanos</span>
              </Link>
            </motion.div>
          </div>

          <div className="mt-12 flex items-center">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-white overflow-hidden"
                >
                  <Image
                    src={`https://randomuser.me/api/portraits/men/${20 + i}.jpg`}
                    alt={`Cliente ${i}`}
                    width={40}
                    height={40}
                  />
                </div>
              ))}
            </div>
            <div className="ml-4 text-sm text-black">
              <span className="font-semibold">+100 clientes</span> confían en nosotros
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
