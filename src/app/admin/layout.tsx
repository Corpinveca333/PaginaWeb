import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administración | Corpinveca',
  description: 'Panel de administración de Corpinveca',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-custom-negro pt-16 pb-12">
      <div className="max-w-7xl mx-auto">{children}</div>
    </div>
  );
}
