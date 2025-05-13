'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRequestList } from '@/context/RequestListContext';
import { REMOVE_ITEM, CLEAR_LIST } from '@/context/requestListReducer';

export default function SolicitudPage() {
  const { state, dispatch } = useRequestList();
  const { items } = state;

  // Estados del formulario
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [submissionStatus, setSubmissionStatus] = useState<string | null>(null);

  // Calcular el total de la solicitud usando useMemo
  const totalSolicitud = useMemo(() => {
    return items.reduce((acc, item) => {
      const price = Number(item.price) || 0;
      return acc + price;
    }, 0);
  }, [items]);

  const handleRemoveItem = (itemId: string | number) => {
    dispatch({ type: REMOVE_ITEM, payload: { id: itemId } });
  };

  const handleClearList = () => {
    dispatch({ type: CLEAR_LIST });
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!items || items.length === 0) {
      setStatusMessage('Tu lista de solicitud está vacía.');
      setSubmissionStatus('error');
      return;
    }
    if (!fullName || !email) {
      setStatusMessage('Nombre completo y correo electrónico son obligatorios.');
      setSubmissionStatus('error');
      return;
    }
    setIsLoading(true);
    setStatusMessage('');
    setSubmissionStatus(null);
    const payload = {
      fullName,
      email,
      phone,
      companyName,
      message,
      requestList: items,
    };
    try {
      const response = await fetch('/api/submit-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const responseData = await response.json();
      if (response.ok) {
        setStatusMessage(responseData.message || '¡Solicitud enviada con éxito!');
        setSubmissionStatus('success');
        setFullName('');
        setEmail('');
        setPhone('');
        setCompanyName('');
        setMessage('');
        dispatch({ type: CLEAR_LIST });
      } else {
        setStatusMessage(responseData.message || 'Error al enviar la solicitud. Intenta de nuevo.');
        setSubmissionStatus('error');
      }
    } catch (error) {
      setStatusMessage('Error de red o al procesar la solicitud. Intenta de nuevo.');
      setSubmissionStatus('error');
      console.error('Error en handleSubmit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Tu Solicitud de Cotización
        </h1>

        {items.length > 0 ? (
          <>
            <div className="overflow-x-auto bg-base-100 text-base-content rounded-lg shadow mb-6">
              <table className="table w-full">
                {/* Cabecera de la Tabla */}
                <thead className="text-base-content/75">
                  <tr>
                    <th className="bg-transparent px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="bg-transparent px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Detalles
                    </th>
                    <th className="bg-transparent px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="bg-transparent px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-300">
                  {items.map(item => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12">
                            <Image
                              src={item.image || '/placeholder-product-image.jpg'}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-md object-cover"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{item.name}</div>
                        {item.sku && (
                          <div className="text-xs text-gray-400 mt-1">SKU: {item.sku}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {typeof item.price === 'number' ? (
                          <span className="text-sm font-semibold text-gray-100">
                            {Number(item.price).toLocaleString('es-CL', {
                              style: 'currency',
                              currency: 'CLP',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            })}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="btn btn-xs btn-ghost text-error hover:bg-error hover:text-error-content"
                          aria-label={`Eliminar ${item.name}`}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mostrar el total de la solicitud */}
            <div className="text-right mb-6 pr-4">
              <p className="text-lg font-semibold text-base-content">
                Total Estimado:
                <span className="ml-2 text-xl text-primary">
                  {Number(totalSolicitud).toLocaleString('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </span>
              </p>
            </div>

            <div className="flex justify-between items-center gap-4 mb-8">
              <button onClick={handleClearList} className="btn btn-outline btn-warning btn-sm">
                Limpiar Lista
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-base-content/70 mb-8">
            <p>Tu lista de solicitud está vacía.</p>
            <Link href="/productos" className="link link-primary font-semibold mt-4 inline-block">
              Ver Productos
            </Link>
          </div>
        )}

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-2xl font-semibold mb-6 text-center text-base-content">
                Completa tus Datos para Enviar
              </h2>

              <div className="form-control w-full">
                <label className="label" htmlFor="fullName">
                  <span className="label-text text-base-content font-bold">Nombre Completo*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  className="input input-bordered w-full text-base-content focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="form-control w-full">
                <label className="label" htmlFor="email">
                  <span className="label-text text-base-content font-bold">
                    Correo Electrónico*
                  </span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="input input-bordered w-full text-base-content focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="form-control w-full">
                <label className="label" htmlFor="phone">
                  <span className="label-text text-base-content font-bold">Teléfono</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="input input-bordered w-full text-base-content focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="form-control w-full">
                <label className="label" htmlFor="companyName">
                  <span className="label-text text-base-content font-bold">
                    Nombre de la Empresa
                  </span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="input input-bordered w-full text-base-content focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="form-control w-full">
                <label className="label" htmlFor="message">
                  <span className="label-text text-base-content font-bold">Mensaje Adicional</span>
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  className="textarea textarea-bordered w-full text-base-content focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-center mt-6">
                <button
                  type="submit"
                  disabled={isLoading || items.length === 0}
                  className="btn btn-primary w-full max-w-xs disabled:opacity-50"
                  title={items.length === 0 ? 'Añade productos a la lista antes de enviar' : ''}
                >
                  {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
                </button>
              </div>

              {statusMessage && (
                <div
                  className={`alert ${submissionStatus === 'success' ? 'alert-success' : 'alert-error'} mt-4`}
                >
                  <span>{statusMessage}</span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
