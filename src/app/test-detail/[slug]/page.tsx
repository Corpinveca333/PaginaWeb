import type { Metadata } from 'next';

interface TestDetailPageProps {
  params: { slug: string };
}

// generateMetadata mínimo
export async function generateMetadata({ params }: TestDetailPageProps): Promise<Metadata> {
  const slug = params.slug;
  console.log('[TEST METADATA] generateMetadata: params recibidos =', params);
  console.log('[TEST METADATA] generateMetadata: slug extraído =', slug);

  // Sin llamadas a API, solo para probar la resolución de params
  await new Promise(resolve => setTimeout(resolve, 50)); // Simular un pequeño delay asíncrono

  return {
    title: `Página de Prueba: ${slug}`,
  };
}

// Componente de página mínimo
export default async function TestDetailPage({ params }: TestDetailPageProps) {
  const slug = params.slug;
  console.log('[TEST PAGE] TestDetailPage: params recibidos =', params);
  console.log('[TEST PAGE] TestDetailPage: slug extraído =', slug);

  // Sin llamadas a API, solo para probar la resolución de params
  await new Promise(resolve => setTimeout(resolve, 50)); // Simular un pequeño delay asíncrono

  return (
    <div>
      <h1>Página de Prueba de Detalle</h1>
      <p>Slug recibido: {slug}</p>
      <p>Este es solo un test para verificar el manejo de params.</p>
    </div>
  );
}
