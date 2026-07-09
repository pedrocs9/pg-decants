'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/components/cart/CartContext';
import { useSession } from 'next-auth/react';
import { createCheckoutPreference, getShippingInfo } from './actions';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';

const inputClass =
  'border border-brand-beige-line px-3 py-2.5 text-sm outline-none focus:border-brand-gold transition-colors w-full';

export default function CheckoutPage() {
  const { items, total, itemCount } = useCart();
  const { data: session } = useSession();
  const [shipping, setShipping] = useState({ cost: 0, freeThreshold: null as number | null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'transbank'>('mercadopago');

  useEffect(() => {
    getShippingInfo(total).then(setShipping);
  }, [total]);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    rut: '',
    street: '',
    apartment: '',
    city: '',
    region: '',
    postalCode: '',
  });

  useEffect(() => {
    if (session?.user) {
      const [first, ...rest] = (session.user?.name ?? '').split(' ');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm((f) => ({
        ...f,
        firstName: first ?? f.firstName,
        lastName: rest.join(' ') || f.lastName,
        email: session.user?.email ?? f.email,
      }));
    }
  }, [session]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (paymentMethod === 'transbank') {
      setError('Webpay/Transbank estará disponible pronto. Por ahora paga con Mercado Pago.');
      return;
    }

    setLoading(true);

    const fullName = `${form.firstName} ${form.lastName}`.trim();
    const street = form.apartment ? `${form.street}, ${form.apartment}` : form.street;

    const result = await createCheckoutPreference({
      fullName,
      email: form.email,
      phone: form.phone,
      street,
      city: form.city,
      region: form.region,
      postalCode: form.postalCode,
    });

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (result.checkoutUrl) {
      window.location.href = result.checkoutUrl;
    }
  }

  if (itemCount === 0) {
    return (
      <main className="flex flex-col flex-1 w-full min-w-0">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-32">
          <p className="text-brand-text-muted">Tu carrito está vacío</p>
          <Link href="/decants" className="text-brand-gold-dark hover:underline">
            Explorar decants
          </Link>
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
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            {/* Contacto */}
            <section className="flex flex-col gap-4">
              <h2 className="text-sm uppercase tracking-wide text-brand-text-muted">Contacto</h2>

              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                required
                value={form.email}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Teléfono"
                required
                value={form.phone}
                onChange={handleChange}
                className={inputClass}
              />
            </section>

            {/* Entrega */}
            <section className="flex flex-col gap-4">
              <h2 className="text-sm uppercase tracking-wide text-brand-text-muted">Entrega</h2>

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="Nombre"
                  required
                  value={form.firstName}
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Apellidos"
                  required
                  value={form.lastName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <input
                type="text"
                name="rut"
                placeholder="RUT (sin puntos y con guión)"
                value={form.rut}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                type="text"
                name="street"
                placeholder="Dirección (calle y número)"
                required
                value={form.street}
                onChange={handleChange}
                className={inputClass}
              />

              <input
                type="text"
                name="apartment"
                placeholder="Departamento, oficina, etc. (opcional)"
                value={form.apartment}
                onChange={handleChange}
                className={inputClass}
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="Comuna"
                  required
                  value={form.city}
                  onChange={handleChange}
                  className={inputClass}
                />
                <input
                  type="text"
                  name="region"
                  placeholder="Región"
                  required
                  value={form.region}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <input
                type="text"
                name="postalCode"
                placeholder="Código postal (opcional)"
                value={form.postalCode}
                onChange={handleChange}
                className={inputClass}
              />
            </section>

            {/* Pago */}
            <section className="flex flex-col gap-4">
              <div>
                <h2 className="text-sm uppercase tracking-wide text-brand-text-muted mb-1">Método de pago</h2>
                <p className="text-xs text-brand-text-muted">Pago 100% protegido. Elige la mejor opción para ti.</p>
              </div>

              <div className="flex flex-col gap-3">
                {/* Mercado Pago */}
                <label
                  className={`flex items-center gap-3 border px-4 py-3.5 cursor-pointer transition-colors ${
                    paymentMethod === 'mercadopago'
                      ? 'border-brand-gold bg-brand-cream/50'
                      : 'border-brand-beige-line hover:border-brand-gold/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'mercadopago'}
                    onChange={() => setPaymentMethod('mercadopago')}
                    className="accent-brand-gold w-4 h-4"
                  />
                  <span className="text-sm text-brand-text-dark flex-1">Mercado Pago</span>
                  <span className="text-xs text-brand-text-muted">Tarjetas, transferencia y más</span>
                </label>

                {/* Transbank - próximamente */}
                <label className="flex items-center gap-3 border border-brand-beige-line px-4 py-3.5 opacity-50 cursor-not-allowed">
                  <input type="radio" disabled className="accent-brand-gold w-4 h-4" />
                  <span className="text-sm text-brand-text-dark flex-1">Webpay (Transbank)</span>
                  <span className="text-[10px] uppercase tracking-wide bg-brand-beige-line text-brand-text-muted px-2 py-1">
                    Próximamente
                  </span>
                </label>
              </div>
            </section>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-black text-brand-cream py-3.5 text-sm font-medium tracking-wide hover:bg-brand-text-dark transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Redirigiendo a Mercado Pago...' : 'Pagar con Mercado Pago'}
            </button>
          </form>

          {/* Resumen - sticky */}
          <div className="bg-brand-white p-6 h-fit lg:sticky lg:top-24">
            <h2 className="text-sm uppercase tracking-wide text-brand-text-muted mb-4">Resumen del Pedido</h2>

            <div className="flex flex-col gap-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative w-16 h-16 bg-brand-cream flex-shrink-0 overflow-hidden">
                    {item.image && <Image src={item.image} alt={item.productName} fill className="object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-brand-text-dark truncate">{item.productName}</p>
                    <p className="text-xs text-brand-text-muted">{item.sizeMl}ml x {item.quantity}</p>
                  </div>
                  <p className="text-sm text-brand-text-dark">
                    ${(Number(item.price) * item.quantity).toLocaleString('es-CL')}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-beige-line pt-4 flex flex-col gap-2">
              <div className="flex justify-between text-sm text-brand-text-muted">
                <span>Subtotal</span>
                <span>${total.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between text-sm text-brand-text-muted">
                <span>Envío</span>
                <span>{shipping.cost === 0 ? 'Gratis' : `$${shipping.cost.toLocaleString('es-CL')}`}</span>
              </div>
              <div className="flex justify-between text-lg font-display italic text-brand-text-dark pt-2 border-t border-brand-beige-line mt-2">
                <span>Total</span>
                <span>${(total + shipping.cost).toLocaleString('es-CL')} CLP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}