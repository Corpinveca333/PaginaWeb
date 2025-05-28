'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';

export default function ImageDashboard() {
  const [images, setImages] = useState<Array<{ name: string; url: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [authChecking, setAuthChecking] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const BUCKET_NAME = 'imagenes_servicios';

  // Verificar autenticación
  useEffect(() => {
    async function checkAuth() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          // Si no hay sesión, redirigir al login
          router.push('/admin');
          return;
        }

        setAuthChecking(false);
        loadImages();
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        router.push('/admin');
      }
    }

    checkAuth();
  }, [router, supabase]);

  // Función para cargar imágenes desde Supabase
  const loadImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.storage.from(BUCKET_NAME).list();

      if (error) {
        throw error;
      }

      if (data) {
        // Obtener URLs públicas para cada imagen
        const imageList = await Promise.all(
          data.map(async item => {
            const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(item.name);
            return {
              name: item.name,
              url: urlData.publicUrl,
            };
          })
        );
        setImages(imageList);
      }
    } catch (error) {
      console.error('Error al cargar imágenes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = () => {
    // Recargar la lista de imágenes después de una subida exitosa
    loadImages();
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/admin');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  // Función para copiar URL al portapapeles
  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copiada al portapapeles');
  };

  if (authChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-300">Verificando autenticación...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-100">Administración de Imágenes</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel de subida */}
        <div className="md:col-span-1">
          <ImageUploader bucket={BUCKET_NAME} onUploadComplete={handleUploadComplete} />
        </div>

        {/* Lista de imágenes */}
        <div className="md:col-span-2 bg-custom-rey p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-medium text-gray-100 mb-4">Imágenes Subidas</h2>

          {loading ? (
            <p className="text-gray-300">Cargando imágenes...</p>
          ) : images.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {images.map(image => (
                <div key={image.name} className="bg-gray-800 rounded overflow-hidden">
                  <div className="relative h-40">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-3">
                    <div className="text-sm text-gray-300 truncate mb-2">{image.name}</div>
                    <button
                      onClick={() => copyToClipboard(image.url)}
                      className="w-full text-xs bg-custom-naranja text-white py-1 px-2 rounded
                        hover:bg-amber-600 transition-colors"
                    >
                      Copiar URL
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-300">No hay imágenes subidas</p>
          )}
        </div>
      </div>
    </div>
  );
}
