'use client';

import Link from 'next/link';
import React from 'react';
import { useRequestList } from '@/context/RequestListContext';

export default function FloatingActionButtons() {
  const { state } = useRequestList();
  const itemCount = state.items.length;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-3">
      {/* Ícono y Contador de Lista de Solicitud */}
      <Link href="/solicitud" className="indicator">
        {itemCount > 0 && (
          <span className="indicator-item badge badge-secondary animate-pulse">{itemCount}</span>
        )}
        <div className="grid w-14 h-14 bg-primary hover:bg-primary-focus text-primary-content place-content-center rounded-full shadow-lg transition-transform hover:scale-110">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"
            />
          </svg>
        </div>
      </Link>

      {/* Botón de WhatsApp */}
      <button
        className="grid w-14 h-14 bg-[#25D366] hover:bg-[#1DAE54] place-content-center rounded-full shadow-lg transition-transform hover:scale-110"
        onClick={() => {
          const numeroWhatsApp = '56935210371';
          const mensajeWhatsApp = encodeURIComponent(
            'Hola, estoy interesado en sus servicios/productos.'
          );
          window.open(`https://wa.me/${numeroWhatsApp}?text=${mensajeWhatsApp}`, '_blank');
        }}
        aria-label="Contactar por WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="black"
          className="w-7 h-7"
        >
          <path
            fillRule="evenodd"
            d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.819V19.5a3 3 0 0 1-3 3h-2.25C6.852 22.5 1.5 17.148 1.5 10.5V8.25V4.5Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
