'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor complete todos los campos');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar administrador');
      }

      setSuccess('Usuario administrador registrado correctamente. Redirigiendo al login...');

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    } catch (error: any) {
      console.error('Error en registro:', error);
      setError(error.message || 'Error al registrar administrador');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-custom-negro">
      <div className="w-full max-w-md p-8 space-y-8 bg-custom-rey rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Registrar Administrador</h1>
          <p className="mt-2 text-gray-400">
            Complete el formulario para crear una cuenta de administrador
          </p>
        </div>

        {error && <div className="p-3 bg-red-500 text-white text-sm rounded">{error}</div>}
        {success && <div className="p-3 bg-green-500 text-white text-sm rounded">{success}</div>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
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
                placeholder="admin@corpinveca.com"
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
              {loading ? 'Registrando...' : 'Registrar Administrador'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
