'use client';

import { deleteProduct } from './actions';

export function DeleteButton({ productId, productName }: { productId: number; productName: string }) {
  async function handleDelete() {
    if (confirm(`¿Eliminar "${productName}"? Esta acción no se puede deshacer.`)) {
      await deleteProduct(productId);
    }
  }

  return (
    <button onClick={handleDelete} className="text-red-600 hover:underline cursor-pointer">
      Eliminar
    </button>
  );
}