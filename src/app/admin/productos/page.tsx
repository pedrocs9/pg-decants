import Link from 'next/link';
import Image from 'next/image';
import { getProductsList } from './actions';
import { DeleteButton } from './DeleteButton';

const typeLabels: Record<string, string> = {
  arabe: 'Árabe',
  diseñador: 'Diseñador',
  nicho: 'Nicho',
};

export default async function AdminProductsPage() {
  const productsList = await getProductsList();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display italic text-3xl text-brand-text-dark">Productos</h1>
          <p className="text-sm text-brand-text-muted mt-1">
            {productsList.length} {productsList.length === 1 ? 'producto' : 'productos'} en tu catálogo
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="bg-brand-gold text-brand-black px-5 py-2.5 text-sm font-medium tracking-wide hover:bg-brand-gold-dark hover:text-brand-cream transition-colors"
        >
          + Nuevo Producto
        </Link>
      </div>

      <div className="bg-brand-white border border-brand-beige-line overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand-beige-line text-left text-xs uppercase tracking-wide text-brand-text-muted bg-brand-cream/50">
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Marca</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Destacado</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productsList.map((product) => (
              <tr
                key={product.id}
                className="border-b border-brand-beige-line last:border-0 hover:bg-brand-cream/30 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative w-11 h-11 flex-shrink-0 bg-brand-cream overflow-hidden">
                      {product.image ? (
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-beige-line text-[10px]">
                          Sin foto
                        </div>
                      )}
                    </div>
                    <span className="text-brand-text-dark font-medium">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-brand-text-muted">{product.brandName}</td>
                <td className="px-4 py-3 text-brand-text-muted">{typeLabels[product.perfumeType]}</td>
                <td className="px-4 py-3">
                  {product.isFeatured ? (
                    <span className="text-xs px-2 py-1 bg-brand-gold/20 text-brand-gold-dark">Destacado</span>
                  ) : (
                    <span className="text-brand-text-muted text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 ${
                      product.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {product.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-4">
                    <Link
                      href={`/admin/productos/${product.id}`}
                      className="text-brand-gold-dark hover:underline font-medium"
                    >
                      Editar
                    </Link>
                    <DeleteButton productId={product.id} productName={product.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {productsList.length === 0 && (
          <p className="text-center py-16 text-brand-text-muted">No hay productos todavía.</p>
        )}
      </div>
    </div>
  );
}