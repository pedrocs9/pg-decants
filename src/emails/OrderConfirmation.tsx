import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Hr,
} from '@react-email/components';

type OrderItem = {
  productName: string;
  sizeMl: number;
  quantity: number;
  unitPrice: string;
};

type OrderConfirmationProps = {
  orderId: number;
  customerName: string;
  items: OrderItem[];
  subtotal: string;
  shippingTotal: string;
  total: string;
  address: {
    street: string;
    city: string;
    region: string;
  };
};

export default function OrderConfirmation({
  orderId,
  customerName,
  items,
  subtotal,
  shippingTotal,
  total,
  address,
}: OrderConfirmationProps) {
  return (
    <Html>
      <Head />
     <Preview>{`Confirmación de tu pedido #${orderId} - P&G Decants`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={logo}>P&G Decants</Heading>

          <Section style={content}>
            <Heading style={h1}>¡Gracias por tu compra, {customerName}!</Heading>
            <Text style={text}>
              Tu pedido <strong>#{orderId}</strong> fue confirmado y ya lo estamos preparando.
            </Text>

            <Hr style={hr} />

            <Heading style={h2}>Detalle del Pedido</Heading>
            {items.map((item, i) => (
              <Row key={i} style={itemRow}>
                <Column>
                  <Text style={itemText}>
                    {item.productName} {item.sizeMl}ml x {item.quantity}
                  </Text>
                </Column>
                <Column align="right">
                  <Text style={itemText}>
                    ${(Number(item.unitPrice) * item.quantity).toLocaleString('es-CL')}
                  </Text>
                </Column>
              </Row>
            ))}

            <Hr style={hr} />

            <Row style={itemRow}>
              <Column><Text style={mutedText}>Subtotal</Text></Column>
              <Column align="right"><Text style={mutedText}>${Number(subtotal).toLocaleString('es-CL')}</Text></Column>
            </Row>
            <Row style={itemRow}>
              <Column><Text style={mutedText}>Envío</Text></Column>
              <Column align="right"><Text style={mutedText}>${Number(shippingTotal).toLocaleString('es-CL')}</Text></Column>
            </Row>
            <Row style={itemRow}>
              <Column><Text style={totalText}>Total</Text></Column>
              <Column align="right"><Text style={totalText}>${Number(total).toLocaleString('es-CL')}</Text></Column>
            </Row>

            <Hr style={hr} />

            <Heading style={h2}>Dirección de Envío</Heading>
            <Text style={text}>
              {address.street}<br />
              {address.city}, {address.region}
            </Text>

            <Text style={footer}>
              Si tienes alguna duda, escríbenos respondiendo este correo o por WhatsApp.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#F8F4EC',
  fontFamily: 'Helvetica, Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '40px 20px',
  maxWidth: '560px',
};

const logo = {
  fontSize: '24px',
  fontStyle: 'italic',
  textAlign: 'center' as const,
  color: '#100D0A',
  marginBottom: '32px',
};

const content = {
  backgroundColor: '#FFFFFF',
  padding: '32px',
  border: '1px solid #EAE3D5',
};

const h1 = {
  fontSize: '20px',
  color: '#3A342C',
  marginBottom: '8px',
};

const h2 = {
  fontSize: '14px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  color: '#6B6459',
  marginTop: '24px',
  marginBottom: '12px',
};

const text = {
  fontSize: '14px',
  color: '#3A342C',
  lineHeight: '1.6',
};

const mutedText = {
  fontSize: '13px',
  color: '#6B6459',
};

const totalText = {
  fontSize: '16px',
  fontWeight: 'bold' as const,
  color: '#3A342C',
};

const itemText = {
  fontSize: '13px',
  color: '#3A342C',
};

const itemRow = {
  marginBottom: '4px',
};

const hr = {
  borderColor: '#EAE3D5',
  margin: '20px 0',
};

const footer = {
  fontSize: '12px',
  color: '#8A8378',
  marginTop: '24px',
  textAlign: 'center' as const,
};