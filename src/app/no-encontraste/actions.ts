'use server';

import { db } from '@/db';
import { perfumeRequests } from '@/db/schema';
import { Resend } from 'resend';
import { perfumeRequestSchema } from '@/lib/validations';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitPerfumeRequest(data: {
  name: string;
  email: string;
  perfumeName: string;
  notes: string;
}) {
  const parsed = perfumeRequestSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  await db.insert(perfumeRequests).values({
    name: parsed.data.name,
    email: parsed.data.email,
    perfumeName: parsed.data.perfumeName,
    notes: parsed.data.notes || null,
  });

  try {
    await resend.emails.send({
      from: 'P&G Decants <onboarding@resend.dev>',
      to: 'pedro.cotaipi.s@gmail.com',
      replyTo: parsed.data.email,
      subject: `Solicitud de perfume: ${parsed.data.perfumeName}`,
      html: `
        <h2>Nueva solicitud de perfume</h2>
        <p><strong>Cliente:</strong> ${parsed.data.name} (${parsed.data.email})</p>
        <p><strong>Perfume solicitado:</strong> ${parsed.data.perfumeName}</p>
        ${parsed.data.notes ? `<p><strong>Notas:</strong> ${parsed.data.notes}</p>` : ''}
      `,
    });
  } catch (error) {
    console.error('Error enviando notificación de solicitud:', error);
  }

  return { success: true };
}