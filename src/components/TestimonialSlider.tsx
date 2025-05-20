'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import TestimonialCard from '@/components/TestimonialCard';

const testimonialsData = [
  {
    id: 1,
    quote:
      'Corpinveca mejoró nuestra producción y el soporte fue excelente. Muy recomendados siempre.',
    name: 'Juan Ramírez',
    role: 'Supervisor de Planta, Metalúrgica Andina',
    avatarUrl: '/reseña01.jpeg',
  },
  {
    id: 2,
    quote:
      'El servicio y la calidad de Corpinveca superaron nuestras expectativas. Socios confiables.',
    name: 'Carlos Fernández',
    role: 'Gerente General, Agroindustrial del Sur',
    avatarUrl: '/reseña02.jpeg',
  },
  {
    id: 3,
    quote:
      'Gracias a Corpinveca optimizamos procesos y reducimos costos rápidamente. Muy satisfechos.',
    name: 'Miguel Torres',
    role: 'Director de Operaciones, Alimentos del Valle',
    avatarUrl: '/reseña03.jpeg',
  },
];

export default function TestimonialSlider() {
  return (
    <div className="max-w-sm mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl">
      <Swiper
        modules={[Pagination, Navigation, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        className="mySwiper"
        breakpoints={{
          768: { slidesPerView: 1, spaceBetween: 30 },
          1024: { slidesPerView: 1, spaceBetween: 30 },
        }}
      >
        {testimonialsData.map(testimonial => (
          <SwiperSlide key={testimonial.id} className="pb-10 pt-2 px-2">
            <TestimonialCard
              quote={testimonial.quote}
              name={testimonial.name}
              role={testimonial.role}
              avatarUrl={testimonial.avatarUrl}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
