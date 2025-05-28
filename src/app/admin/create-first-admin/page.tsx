'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateFirstAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !secretKey) {
      setError('Por favor complete todos los campos');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
      formData.append('secret_key', secretKey);

      const response = await fetch('/api/create-admin', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al crear el usuario administrador');
      }

      setSuccess('Usuario administrador creado correctamente. Redirigiendo al login...');

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Error al crear el usuario administrador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-custom-negro">
      <div className="w-full max-w-md p-8 space-y-8 bg-custom-rey rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Crear Primer Administrador</h1>
          <p className="mt-2 text-gray-400">
            Esta página solo debe usarse una vez para configurar el primer usuario administrador
          </p>
        </div>

        {error && <div className="p-3 bg-red-500 text-white text-sm rounded">{error}</div>}
        {success && <div className="p-3 bg-green-500 text-white text-sm rounded">{success}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email del Administrador
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-600 
                           rounded-md text-black placeholder-gray-500 focus:outline-none 
                           focus:ring-2 focus:ring-custom-naranja focus:border-custom-naranja"
                placeholder="admin@ejemplo.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-600 
                           rounded-md text-black placeholder-gray-500 focus:outline-none 
                           focus:ring-2 focus:ring-custom-naranja focus:border-custom-naranja"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label htmlFor="secretKey" className="block text-sm font-medium text-gray-300">
                Clave Secreta
              </label>
              <input
                id="secretKey"
                name="secretKey"
                type="password"
                required
                value={secretKey}
                onChange={e => setSecretKey(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-600 
                           rounded-md text-black placeholder-gray-500 focus:outline-none 
                           focus:ring-2 focus:ring-custom-naranja focus:border-custom-naranja"
                placeholder="Clave secreta para crear administrador"
              />
              <p className="mt-1 text-xs text-gray-400">
                Esta clave debe coincidir con la variable de entorno ADMIN_SECRET_KEY
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent 
                         rounded-md shadow-sm text-sm font-medium text-white bg-custom-naranja 
                         hover:bg-amber-600 focus:outline-none focus:ring-2 
                         focus:ring-offset-2 focus:ring-custom-naranja
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando usuario...' : 'Crear Administrador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
