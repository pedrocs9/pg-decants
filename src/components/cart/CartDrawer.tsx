'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from './CartContext';
import { updateCartItemQuantity, removeCartItem } from '@/app/cart-actions';
import { CloseIcon, CartIcon } from '@/components/icons';

export function CartDrawer() {
  const { items, total, isOpen, closeCart, refreshCart } = useCart();

  async function handleQuantityChange(itemId: number, newQty: number) {
    await updateCartItemQuantity(itemId, newQty);
    await refreshCart();
  }

  async function handleRemove(itemId: number) {
    await removeCartItem(itemId);
    await refreshCart();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-brand-black/50" onClick={closeCart} />

      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-brand-cream flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-brand-beige-line">
          <h2 className="font-display italic text-2xl text-brand-text-dark">Tu Carrito</h2>
          <button onClick={closeCart} className="cursor-pointer text-brand-text-dark hover:text-brand-gold-dark transition-colors">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <CartIcon className="w-12 h-12 text-brand-beige-line" />
            <p className="text-brand-text-muted text-center">Tu carrito está vacío</p>
            <Link
              href="/decants"
              onClick={closeCart}
              className="text-sm text-brand-gold-dark hover:underline"
            >
              Explorar decants
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-5">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-brand-white flex-shrink-0 overflow-hidden">
                    {item.image && (
                      <Image src={item.image} alt={item.productName} fill className="object-cover" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-brand-text-muted uppercase">{item.brandName}</p>
                    <p className="text-sm text-brand-text-dark truncate">{item.productName}</p>
                    <p className="text-xs text-brand-text-muted mb-2">{item.sizeMl}ml</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-brand-beige-line">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-brand-text-dark hover:bg-brand-white transition-colors cursor-pointer"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-7 h-7 flex items-center justify-center text-brand-text-dark hover:bg-brand-white transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-sm text-brand-gold-dark font-medium">
                        ${(Number(item.price) * item.quantity).toLocaleString('es-CL')}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    aria-label="Eliminar"
                    className="text-brand-text-muted hover:text-red-600 transition-colors cursor-pointer flex-shrink-0"
                  >
                    <CloseIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-beige-line px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-brand-text-dark">Subtotal</span>
                <span className="text-xl font-display italic text-brand-text-dark">
                  ${total.toLocaleString('es-CL')} CLP
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                
                className="block w-full text-center  bg-brand-black text-brand-cream py-3.5 text-sm font-medium tracking-wide hover:bg-brand-text-dark transition-colors"
              >
                Ir a Pagar
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}