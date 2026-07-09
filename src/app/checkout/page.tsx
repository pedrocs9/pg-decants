'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/components/cart/CartContext';
import { useSession } from 'next-auth/react';
import { createCheckoutPreference } from './actions';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { REGIONS, SHIPPING_ZONES, getComunasByRegion, getZoneByRegionCode } from '@/lib/chile-regions';

const inputClass = 'border border-brand-beige-line px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors w-full bg-brand-white';
const selectClass = 'border border-brand-beige-line px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors w-full bg-brand-white cursor-pointer';

const FREE_THRESHOLD = 20000;

export default function CheckoutPage() {
  const { items, total, itemCount } = useCart();
  const { data: session } = useSession();
const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'webpay'>('mercadopago');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    rut: '',
    street: '',
    apartment: '',
    regionCode: '',
    comuna: '',
    postalCode: '',
  });

  const comunas = form.regionCode ? getComunasByRegion(form.regionCode) : [];
  const zone = form.regionCode ? getZoneByRegionCode(form.regionCode) : null;
  const zoneInfo = zone ? SHIPPING_ZONES[zone] : null;
  const shippingCost = !zoneInfo ? null : total >= FREE_THRESHOLD ? 0 : zoneInfo.price;
  const orderTotal = total + (shippingCost ?? 0);

  useEffect(() => {
    if (!session?.user) return;
    const [first, ...rest] = (session.user?.name ?? '').split(' ');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm((f) => ({
      ...f,
      firstName: first ?? f.firstName,
      lastName: rest.join(' ') || f.lastName,
      email: session.user?.email ?? f.email,
    }));
  }, [session?.user]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    if (name === 'regionCode') {
      setForm((f) => ({ ...f, regionCode: value, comuna: '' }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  }

 async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.regionCode || !form.comuna) {
      setError('Selecciona tu región y comuna.');
      return;
    }
    setError('');
    setLoading(true);

    if (paymentMethod === 'webpay') {
      const res = await fetch('/api/webpay/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }
      // Webpay requiere un formulario POST con el token
      const form2 = document.createElement('form');
      form2.method = 'POST';
      form2.action = data.url;
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'token_ws';
      input.value = data.token;
      form2.appendChild(input);
      document.body.appendChild(form2);
      form2.submit();
      return;
    }

    const result = await createCheckoutPreference({ ...form });
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    if (result.checkoutUrl) window.location.href = result.checkoutUrl;
  }

  if (itemCount === 0) {
    return (
      <main className="flex flex-col flex-1 w-full min-w-0">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-32">
          <p className="text-brand-text-muted">Tu carrito está vacío</p>
          <Link href="/decants" className="text-brand-gold-dark hover:underline">Explorar decants</Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="flex flex-col flex-1 w-full min-w-0">
      <Header />

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display italic text-4xl text-brand-text-dark mb-10">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start">

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">

            {/* Contacto */}
            <section className="flex flex-col gap-4">
              <h2 className="text-xs uppercase tracking-widest text-brand-text-muted border-b border-brand-beige-line pb-2">Contacto</h2>
              <input type="email" name="email" placeholder="Correo electrónico" required value={form.email} onChange={handleChange} className={inputClass} />
              <input type="tel" name="phone" placeholder="Teléfono (+56 9 XXXX XXXX)" required value={form.phone} onChange={handleChange} className={inputClass} />
            </section>

            {/* Datos personales */}
            <section className="flex flex-col gap-4">
              <h2 className="text-xs uppercase tracking-widest text-brand-text-muted border-b border-brand-beige-line pb-2">Datos personales</h2>
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="firstName" placeholder="Nombre" required value={form.firstName} onChange={handleChange} className={inputClass} />
                <input type="text" name="lastName" placeholder="Apellidos" required value={form.lastName} onChange={handleChange} className={inputClass} />
              </div>
              <input type="text" name="rut" placeholder="RUT (ej: 12.345.678-9)" value={form.rut} onChange={handleChange} className={inputClass} />
            </section>

            {/* Dirección de envío */}
            <section className="flex flex-col gap-4">
              <h2 className="text-xs uppercase tracking-widest text-brand-text-muted border-b border-brand-beige-line pb-2">Dirección de envío</h2>

              {/* Región */}
              <div>
                <label className="text-xs text-brand-text-muted block mb-1">Región *</label>
                <select name="regionCode" required value={form.regionCode} onChange={handleChange} className={selectClass}>
                  <option value="">Selecciona tu región</option>
                  {REGIONS.map((r) => (
                    <option key={r.code} value={r.code}>{r.name}</option>
                  ))}
                </select>
              </div>

              {/* Comuna */}
              <div>
                <label className="text-xs text-brand-text-muted block mb-1">Comuna *</label>
                <select name="comuna" required value={form.comuna} onChange={handleChange} className={selectClass} disabled={!form.regionCode}>
                  <option value="">{form.regionCode ? 'Selecciona tu comuna' : 'Primero selecciona una región'}</option>
                  {comunas.map((c) => (
                    <option key={c.code} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Tarifa de envío en tiempo real */}
              {zoneInfo && (
                <div className={`flex items-center justify-between px-4 py-3 border text-sm ${shippingCost === 0 ? 'border-green-300 bg-green-50' : 'border-brand-beige-line bg-brand-cream'}`}>
                  <div className="flex items-center gap-2">
                    <span>{shippingCost === 0 ? '🎉' : '🚚'}</span>
                    <div>
                      <p className="font-medium text-brand-text-dark">
                        {shippingCost === 0 ? '¡Envío gratis!' : `Envío — ${zoneInfo.label}`}
                      </p>
                      <p className="text-xs text-brand-text-muted">{zoneInfo.days}</p>
                    </div>
                  </div>
                  <span className={`font-medium ${shippingCost === 0 ? 'text-green-600' : 'text-brand-text-dark'}`}>
                    {shippingCost === 0 ? 'Gratis' : `$${zoneInfo.price.toLocaleString('es-CL')}`}
                  </span>
                </div>
              )}

              <input type="text" name="street" placeholder="Calle y número (ej: Av. Providencia 1234)" required value={form.street} onChange={handleChange} className={inputClass} />
              <input type="text" name="apartment" placeholder="Depto, casa, oficina (opcional)" value={form.apartment} onChange={handleChange} className={inputClass} />
              <input type="text" name="postalCode" placeholder="Código postal (opcional)" value={form.postalCode} onChange={handleChange} className={inputClass} />
            </section>

            {/* Método de pago */}
          {/* Método de pago */}
            <section className="flex flex-col gap-4">
              <h2 className="text-xs uppercase tracking-widest text-brand-text-muted border-b border-brand-beige-line pb-2">Método de pago</h2>

              <label
                className={`flex items-center gap-3 border px-4 py-3.5 cursor-pointer transition-colors ${
                  paymentMethod === 'mercadopago'
                    ? 'border-brand-gold bg-brand-cream/50'
                    : 'border-brand-beige-line hover:border-brand-gold/50'
                }`}
              >
                <input type="radio" name="paymentMethod" checked={paymentMethod === 'mercadopago'} onChange={() => setPaymentMethod('mercadopago')} className="accent-brand-gold w-4 h-4" />
                <span className="text-sm text-brand-text-dark flex-1">Mercado Pago</span>
                <span className="text-xs text-brand-text-muted">Tarjetas, transferencia y más</span>
              </label>

              <label
                className={`flex items-center gap-3 border px-4 py-3.5 cursor-pointer transition-colors ${
                  paymentMethod === 'webpay'
                    ? 'border-brand-gold bg-brand-cream/50'
                    : 'border-brand-beige-line hover:border-brand-gold/50'
                }`}
              >
                <input type="radio" name="paymentMethod" checked={paymentMethod === 'webpay'} onChange={() => setPaymentMethod('webpay')} className="accent-brand-gold w-4 h-4" />
                <span className="text-sm text-brand-text-dark flex-1">Webpay (Transbank)</span>
                <span className="text-xs text-brand-text-muted">Débito y crédito chileno</span>
              </label>
            </section>

            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-3">{error}</p>}

            <button
              type="submit"
              disabled={loading || !form.regionCode || !form.comuna}
              className="w-full bg-brand-black text-brand-cream py-4 text-sm font-medium tracking-widest uppercase hover:bg-brand-text-dark transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading
                ? 'Redirigiendo...'
                : paymentMethod === 'webpay'
                ? 'Pagar con Webpay'
                : 'Pagar con Mercado Pago'}
            </button>

            <p className="text-xs text-brand-text-muted text-center">🔒 Pago 100% seguro procesado por Mercado Pago</p>
          </form>

          {/* Resumen sticky */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-6">
            <div className="bg-brand-white border border-brand-beige-line p-6">
              <h2 className="text-xs uppercase tracking-widest text-brand-text-muted mb-5">Resumen del Pedido</h2>

              <div className="flex flex-col gap-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 bg-brand-cream flex-shrink-0 overflow-hidden border border-brand-beige-line">
                      {item.image && <Image src={item.image} alt={item.productName} fill className="object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-brand-text-dark truncate font-medium">{item.productName}</p>
                      <p className="text-xs text-brand-text-muted">{item.sizeMl}ml × {item.quantity}</p>
                    </div>
                    <p className="text-sm text-brand-text-dark flex-shrink-0">
                      ${(Number(item.price) * item.quantity).toLocaleString('es-CL')}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-brand-beige-line pt-4 flex flex-col gap-2.5">
                <div className="flex justify-between text-sm text-brand-text-muted">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString('es-CL')}</span>
                </div>
                <div className="flex justify-between text-sm text-brand-text-muted">
                  <span>Envío</span>
                  <span>
                    {shippingCost === null && <span className="text-xs italic">Selecciona región</span>}
                    {shippingCost === 0 && <span className="text-green-600 font-medium">¡Gratis!</span>}
                    {shippingCost !== null && shippingCost > 0 && `$${shippingCost.toLocaleString('es-CL')}`}
                  </span>
                </div>
                {total < FREE_THRESHOLD && shippingCost !== null && shippingCost > 0 && (
                  <p className="text-xs text-brand-text-muted bg-brand-cream px-3 py-2">
                    🎁 Agrega <strong>${(FREE_THRESHOLD - total).toLocaleString('es-CL')}</strong> más y obtén envío gratis
                  </p>
                )}
                <div className="flex justify-between text-lg font-display italic text-brand-text-dark pt-3 border-t border-brand-beige-line mt-1">
                  <span>Total</span>
                  <span>${orderTotal.toLocaleString('es-CL')} CLP</span>
                </div>
              </div>
            </div>

            {/* Garantías */}
            <div className="flex flex-col gap-3 px-1">
              {[
                { icon: '🔒', text: 'Pago 100% seguro con Mercado Pago' },
                { icon: '📦', text: 'Empaque cuidadoso en cada pedido' },
                { icon: '✅', text: 'Decants 100% originales garantizados' },
              ].map((g) => (
                <div key={g.text} className="flex items-center gap-3 text-xs text-brand-text-muted">
                  <span>{g.icon}</span>
                  {g.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}