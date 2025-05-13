import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h2 className="text-3xl font-bold mb-4">Servicio no encontrado</h2>
      <p className="text-lg mb-6">No pudimos encontrar el servicio que estás buscando.</p>
      <Link
        href="/servicios"
        className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition-colors duration-300"
      >
        Ver todos los servicios
      </Link>
    </div>
  );
}
