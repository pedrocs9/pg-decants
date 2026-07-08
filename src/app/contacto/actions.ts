'use server';

import { Resend } from 'resend';
import { contactSchema } from '@/lib/validations';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactMessage(data: { name: string; email: string; message: string }) {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await resend.emails.send({
      from: 'P&G Decants <onboarding@resend.dev>',
      to: 'pedro.cotaipi.s@gmail.com',
      replyTo: parsed.data.email,
      subject: `Nuevo mensaje de contacto de ${parsed.data.name}`,
      html: `
        <h2>Nuevo mensaje desde el formulario de contacto</h2>
        <p><strong>Nombre:</strong> ${parsed.data.name}</p>
        <p><strong>Email:</strong> ${parsed.data.email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${parsed.data.message.replace(/\n/g, '<br>')}</p>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error enviando email de contacto:', error);
    return { error: 'No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos por WhatsApp.' };
  }
}