import {
  Body, Container, Column, Head, Heading, Html,
  Preview, Row, Section, Text, Hr, Link,
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
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  subtotal: string;
  shippingTotal: string;
  total: string;
  address: { street: string; city: string; region: string };
  paymentMethod?: string;
};

export default function NewOrderAdmin({
  orderId, customerName, customerEmail, customerPhone,
  items, subtotal, shippingTotal, total, address, paymentMethod = 'Mercado Pago',
}: Props) {
  return (
    <Html lang="es">
      <Head />
      <Preview>{`🛍️ Nuevo pedido #${orderId} de ${customerName} — $${Number(total).toLocaleString('es-CL')} CLP`}</Preview>
      <Body style={main}>
        <Container style={container}>

          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>P&G Decants · Panel Admin</Text>
          </Section>

          {/* Alert */}
          <Section style={alertBox}>
            <Text style={alertText}>🛍️ Nuevo pedido recibido</Text>
            <Text style={alertAmount}>${Number(total).toLocaleString('es-CL')} CLP</Text>
            <Text style={alertSub}>Pedido #{orderId} · {paymentMethod}</Text>
          </Section>

          {/* Cliente */}
          <Section style={card}>
            <Heading style={sectionTitle}>👤 Cliente</Heading>
            <Hr style={hr} />
            <Row>
              <Column>
                <Text style={label}>Nombre</Text>
                <Text style={value}>{customerName}</Text>
              </Column>
              <Column>
                <Text style={label}>Email</Text>
                <Text style={value}>{customerEmail}</Text>
              </Column>
            </Row>
            {customerPhone && (
              <Row>
                <Column>
                  <Text style={label}>Teléfono</Text>
                  <Text style={value}>{customerPhone}</Text>
                </Column>
              </Row>
            )}
          </Section>

          {/* Dirección */}
          <Section style={card}>
            <Heading style={sectionTitle}>📍 Dirección de Envío</Heading>
            <Hr style={hr} />
            <Text style={value}>{address.street}</Text>
            <Text style={value}>{address.city}, {address.region}</Text>
          </Section>

          {/* Productos */}
          <Section style={card}>
            <Heading style={sectionTitle}>📦 Productos a despachar</Heading>
            <Hr style={hr} />
            {items.map((item, i) => (
              <Row key={i} style={{ marginBottom: '10px', backgroundColor: i % 2 === 0 ? '#F8F4EC' : '#FFFFFF', padding: '8px' }}>
                <Column>
                  <Text style={{ ...value, margin: '0', fontWeight: 'bold' }}>{item.productName}</Text>
                  <Text style={{ ...label, margin: '2px 0 0' }}>{item.sizeMl}ml × {item.quantity} unidades</Text>
                </Column>
                <Column align="right">
                  <Text style={{ ...value, margin: '0' }}>
                    ${(Number(item.unitPrice) * item.quantity).toLocaleString('es-CL')}
                  </Text>
                </Column>
              </Row>
            ))}
            <Hr style={hr} />
            <Row><Column><Text style={label}>Subtotal</Text></Column><Column align="right"><Text style={label}>${Number(subtotal).toLocaleString('es-CL')}</Text></Column></Row>
            <Row><Column><Text style={label}>Envío</Text></Column><Column align="right"><Text style={label}>{Number(shippingTotal) === 0 ? 'Gratis' : `$${Number(shippingTotal).toLocaleString('es-CL')}`}</Text></Column></Row>
            <Row><Column><Text style={totalLabel}>TOTAL</Text></Column><Column align="right"><Text style={totalLabel}>${Number(total).toLocaleString('es-CL')} CLP</Text></Column></Row>
          </Section>

          {/* CTA */}
          <Section style={{ textAlign: 'center' as const, padding: '16px 0' }}>
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/admin/pedidos/${orderId}`} style={ctaButton}>
              Ver pedido en el admin →
            </Link>
          </Section>

          <Section style={{ textAlign: 'center' as const }}>
            <Text style={{ fontSize: '11px', color: '#8A8378' }}>
              Este correo es automático — P&G Decants
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = { backgroundColor: '#F8F4EC', fontFamily: 'Helvetica, Arial, sans-serif' };
const container = { margin: '0 auto', maxWidth: '560px', padding: '32px 16px' };
const header = { backgroundColor: '#100D0A', padding: '16px 32px', textAlign: 'center' as const };
const logoText = { color: '#C6A15B', fontSize: '16px', fontStyle: 'italic', fontWeight: 'bold', margin: '0', textAlign: 'center' as const };
const alertBox = { backgroundColor: '#100D0A', padding: '24px 32px', textAlign: 'center' as const, marginBottom: '12px' };
const alertText = { color: '#C6A15B', fontSize: '13px', margin: '0 0 4px', textTransform: 'uppercase' as const, letterSpacing: '1px' };
const alertAmount = { color: '#FFFFFF', fontSize: '32px', fontWeight: 'bold', margin: '0 0 4px' };
const alertSub = { color: '#8A8378', fontSize: '12px', margin: '0' };
const card = { backgroundColor: '#FFFFFF', border: '1px solid #EAE3D5', padding: '20px', marginBottom: '12px' };
const sectionTitle = { fontSize: '12px', textTransform: 'uppercase' as const, letterSpacing: '0.5px', color: '#6B6459', margin: '0 0 8px' };
const hr = { borderColor: '#EAE3D5', margin: '10px 0' };
const label = { fontSize: '11px', color: '#8A8378', margin: '0 0 2px', textTransform: 'uppercase' as const, letterSpacing: '0.5px' };
const value = { fontSize: '14px', color: '#3A342C', margin: '0 0 8px' };
const totalLabel = { fontSize: '16px', color: '#3A342C', fontWeight: 'bold', margin: '8px 0 0' };
const ctaButton = { backgroundColor: '#C6A15B', color: '#100D0A', padding: '12px 32px', fontSize: '13px', fontWeight: 'bold', textDecoration: 'none', letterSpacing: '1px' };