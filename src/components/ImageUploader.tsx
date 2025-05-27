'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { v4 as uuidv4 } from 'uuid';

interface ImageUploaderProps {
  bucket: string;
  folder?: string;
  onUploadComplete?: (url: string) => void;
}

export default function ImageUploader({
  bucket = 'imagenes_servicios',
  folder = '',
  onUploadComplete,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const supabase = createClientComponentClient();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      setPreview(null);
      return;
    }

    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    // Crear una URL para previsualización
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // Limpiar error previo si existe
    setError(null);
  };

  const uploadFile = async () => {
    if (!file) {
      setError('Por favor selecciona un archivo');
      return;
    }

    try {
      setUploading(true);

      // Generar un nombre único para el archivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Subir archivo a Supabase Storage
      const { error: uploadError } = await supabase.storage.from(bucket).upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obtener URL pública
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

      // Llamar al callback con la URL
      if (onUploadComplete && data.publicUrl) {
        onUploadComplete(data.publicUrl);
      }

      // Limpiar formulario
      setFile(null);
      setPreview(null);
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-custom-rey p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-medium text-gray-100 mb-4">Subir imagen</h3>

      <div className="mb-4">
        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-2">
          Seleccionar imagen
        </label>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full text-sm text-gray-300
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-custom-naranja file:text-white
            hover:file:bg-amber-600 cursor-pointer
            disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Selecciona una imagen para subir"
        />
      </div>

      {preview && (
        <div className="mb-4">
          <div className="relative w-full h-48 bg-gray-800 rounded overflow-hidden">
            <img
              src={preview}
              alt="Vista previa"
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        </div>
      )}

      {error && <div className="mb-4 p-2 bg-red-500 text-white text-sm rounded">{error}</div>}

      <button
        onClick={uploadFile}
        disabled={!file || uploading}
        className="w-full bg-custom-naranja text-white py-2 px-4 rounded
          hover:bg-amber-600 transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Subiendo...' : 'Subir imagen'}
      </button>
    </div>
  );
}
