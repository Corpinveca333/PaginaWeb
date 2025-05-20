export default function TestEnv() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Prueba de Variable de Entorno</h1>
      <pre className="bg-gray-100 p-4 rounded">
        {process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'NO ENV VAR'}
      </pre>
    </main>
  );
}
