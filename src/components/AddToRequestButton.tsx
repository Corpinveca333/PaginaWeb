'use client';

import { useRequestList, RequestListItem } from '@/context/RequestListContext';
import { ADD_ITEM } from '@/context/requestListReducer';

interface AddToRequestButtonProps {
  item: RequestListItem & { price?: string | number | null };
  className?: string;
}

export default function AddToRequestButton({ item, className = '' }: AddToRequestButtonProps) {
  const { dispatch } = useRequestList();

  const handleAddItem = () => {
    dispatch({ type: ADD_ITEM, payload: item });
    // Aquí podrías mostrar un mensaje de éxito o animación
  };

  // Clases base de DaisyUI que siempre queremos mantener
  const baseClasses = 'btn btn-sm btn-accent';

  // Combinamos las clases base con las clases personalizadas
  const buttonClasses = `${baseClasses} ${className}`.trim();

  return (
    <button type="button" className={buttonClasses} onClick={handleAddItem}>
      Agregar a mi lista
    </button>
  );
}
