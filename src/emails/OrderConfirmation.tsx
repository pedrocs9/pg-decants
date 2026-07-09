import {
  Body, Container, Column, Head, Heading, Html,
  Preview, Row, Section, Text, Hr, Link, Img,
} from '@react-email/components';

type OrderItem = {
  productName: string;
  sizeMl: number;
  quantity: number;
  unitPrice: string;
};

type Props = {
  orderId: number;
  customerName: string;
  items: OrderItem[];
  subtotal: string;
  shippingTotal: string;
  total: string;
  address: { street: string; city: string; region: string };
  paymentMethod?: string;
};

export default function OrderConfirmation({
  orderId, customerName, items, subtotal, shippingTotal, total, address, paymentMethod = 'Mercado Pago',
}: Props) {
  const firstName = customerName.split(' ')[0];

  return (
    <Html lang="es">
      <Head />
      <Preview>{`✅ Tu pedido #${orderId} está confirmado — P&G Decants`}</Preview>
      <Body style={main}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>P&G Decants</Text>
          </Section>

          {/* Hero */}
          <Section style={hero}>
            <Text style={heroEmoji}>🎉</Text>
            <Heading style={heroTitle}>¡Gracias por tu compra, {firstName}!</Heading>
            <Text style={heroSubtitle}>
              Tu pedido <strong style={{ color: '#C6A15B' }}>#{orderId}</strong> fue confirmado y ya lo estamos preparando con cuidado.
            </Text>
          </Section>

          {/* Estado del pedido */}
          <Section style={stepsSection}>
            <Row>
              {[
                { icon: '✅', label: 'Pedido confirmado', active: true },
                { icon: '📦', label: 'En preparación', active: true },
                { icon: '🚚', label: 'En camino', active: false },
                { icon: '🏠', label: 'Entregado', active: false },
              ].map((step, i) => (
                <Column key={i} style={{ textAlign: 'center', padding: '0 4px' }}>
                  <Text style={{ fontSize: '20px', margin: '0 0 4px' }}>{step.icon}</Text>
                  <Text style={{ ...stepLabel, color: step.active ? '#C6A15B' : '#8A8378' }}>{step.label}</Text>
                </Column>
              ))}
            </Row>
          </Section>

          {/* Productos */}
          <Section style={card}>
            <Heading style={sectionTitle}>🛍️ Detalle del Pedido</Heading>
            <Hr style={hr} />
            {items.map((item, i) => (
              <Row key={i} style={{ marginBottom: '12px' }}>
                <Column>
                  <Text style={itemName}>{item.productName}</Text>
                  <Text style={itemMeta}>{item.sizeMl}ml × {item.quantity}</Text>
                </Column>
                <Column align="right">
                  <Text style={itemPrice}>
                    ${(Number(item.unitPrice) * item.quantity).toLocaleString('es-CL')}
                  </Text>
                </Column>
              </Row>
            ))}
            <Hr style={hr} />
            <Row style={{ marginBottom: '6px' }}>
              <Column><Text style={summaryLabel}>Subtotal</Text></Column>
              <Column align="right"><Text style={summaryLabel}>${Number(subtotal).toLocaleString('es-CL')}</Text></Column>
            </Row>
            <Row style={{ marginBottom: '6px' }}>
              <Column><Text style={summaryLabel}>Envío</Text></Column>
              <Column align="right">
                <Text style={summaryLabel}>
                  {Number(shippingTotal) === 0 ? '¡Gratis!' : `$${Number(shippingTotal).toLocaleString('es-CL')}`}
                </Text>
              </Column>
            </Row>
            <Row>
              <Column><Text style={totalLabel}>Total</Text></Column>
              <Column align="right"><Text style={totalLabel}>${Number(total).toLocaleString('es-CL')} CLP</Text></Column>
            </Row>
          </Section>

          {/* Dirección */}
          <Section style={card}>
            <Heading style={sectionTitle}>📍 Dirección de Envío</Heading>
            <Hr style={hr} />
            <Text style={addressText}>{address.street}</Text>
            <Text style={addressText}>{address.city}, {address.region}</Text>
          </Section>

          {/* Método de pago */}
          <Section style={card}>
            <Heading style={sectionTitle}>💳 Método de Pago</Heading>
            <Hr style={hr} />
            <Text style={addressText}>{paymentMethod}</Text>
          </Section>

          {/* CTA */}
          <Section style={{ textAlign: 'center', padding: '24px 0' }}>
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/mi-cuenta/pedidos`} style={ctaButton}>
              Ver mis pedidos
            </Link>
          </Section>

          {/* Info */}
          <Section style={infoBox}>
            <Text style={infoText}>
              ⏱️ Tiempo de preparación: 24-48 horas hábiles<br />
              📦 Te notificaremos cuando tu pedido sea despachado
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerSection}>
            <Text style={footerText}>
              ¿Tienes dudas? Escríbenos por{' '}
              <Link href="https://wa.me/56923736983" style={{ color: '#C6A15B' }}>WhatsApp</Link>
              {' '}o responde este correo.
            </Text>
            <Text style={footerSmall}>
              P&G Decants · Decants 100% originales · Chile
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#F8F4EC', fontFamily: 'Helvetica, Arial, sans-serif' };
const container = { margin: '0 auto', maxWidth: '560px', padding: '32px 16px' };
const header = { backgroundColor: '#100D0A', padding: '20px 32px', textAlign: 'center' as const, marginBottom: '0' };
const logoText = { color: '#C6A15B', fontSize: '22px', fontStyle: 'italic', fontWeight: 'bold', margin: '0', textAlign: 'center' as const };
const hero = { backgroundColor: '#FFFFFF', padding: '32px', textAlign: 'center' as const, borderLeft: '1px solid #EAE3D5', borderRight: '1px solid #EAE3D5' };
const heroEmoji = { fontSize: '40px', margin: '0 0 8px', textAlign: 'center' as const };
const heroTitle = { fontSize: '22px', color: '#3A342C', margin: '0 0 12px', textAlign: 'center' as const };
const heroSubtitle = { fontSize: '14px', color: '#6B6459', lineHeight: '1.6', margin: '0', textAlign: 'center' as const };
const stepsSection = { backgroundColor: '#FFFFFF', padding: '16px 32px 24px', borderLeft: '1px solid #EAE3D5', borderRight: '1px solid #EAE3D5', borderBottom: '1px solid #EAE3D5' };
const stepLabel = { fontSize: '10px', margin: '0', textTransform: 'uppercase' as const, letterSpacing: '0.5px' };
const card = { backgroundColor: '#FFFFFF', border: '1px solid #EAE3D5', padding: '24px', marginBottom: '12px' };
const sectionTitle = { fontSize: '13px', textTransform: 'uppercase' as const, letterSpacing: '0.5px', color: '#6B6459', margin: '0 0 12px' };
const hr = { borderColor: '#EAE3D5', margin: '12px 0' };
const itemName = { fontSize: '14px', color: '#3A342C', margin: '0 0 2px', fontWeight: 'bold' };
const itemMeta = { fontSize: '12px', color: '#8A8378', margin: '0' };
const itemPrice = { fontSize: '14px', color: '#3A342C', margin: '0', fontWeight: 'bold' };
const summaryLabel = { fontSize: '13px', color: '#6B6459', margin: '0' };
const totalLabel = { fontSize: '16px', color: '#3A342C', fontWeight: 'bold', margin: '8px 0 0' };
const addressText = { fontSize: '14px', color: '#3A342C', margin: '0 0 4px' };
const ctaButton = { backgroundColor: '#100D0A', color: '#F8F4EC', padding: '12px 32px', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none', letterSpacing: '1px', textTransform: 'uppercase' as const };
const infoBox = { backgroundColor: '#EAE3D5', padding: '16px 24px', marginBottom: '16px' };
const infoText = { fontSize: '12px', color: '#6B6459', margin: '0', lineHeight: '1.8', textAlign: 'center' as const };
const footerSection = { textAlign: 'center' as const, padding: '16px 0' };
const footerText = { fontSize: '12px', color: '#8A8378', margin: '0 0 8px' };
const footerSmall = { fontSize: '11px', color: '#8A8378', margin: '0' };