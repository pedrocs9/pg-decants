'use server';

import { db } from '@/db';
import { users, verificationTokens } from '@/db/schema';
import { eq, and, gt } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const emailSchema = z.string().trim().email('Ingresa un correo válido');
const passwordSchema = z.string().min(6, 'La contraseña debe tener al menos 6 caracteres');

export async function requestPasswordReset(email: string) {
  const parsed = emailSchema.safeParse(email);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const [user] = await db.select().from(users).where(eq(users.email, parsed.data));

  // Por seguridad, siempre respondemos éxito aunque el email no exista
  // (así no revelamos qué correos están registrados)
  if (!user || !user.password) {
    return { success: true };
  }

  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

  await db.insert(verificationTokens).values({
    identifier: parsed.data,
    token,
    expires,
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;

  try {
    await resend.emails.send({
      from: 'P&G Decants <onboarding@resend.dev>',
      to: parsed.data,
      subject: 'Recupera tu contraseña - P&G Decants',
      html: `
        <h2>Recupera tu contraseña</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña. Haz click en el siguiente enlace (válido por 1 hora):</p>
        <p><a href="${resetUrl}">Restablecer contraseña</a></p>
        <p>Si no solicitaste esto, puedes ignorar este correo.</p>
      `,
    });
  } catch (error) {
    console.error('Error enviando email de recuperación:', error);
    return { error: 'No pudimos enviar el correo. Intenta de nuevo más tarde.' };
  }

  return { success: true };
}

export async function validateResetToken(token: string) {
  const [record] = await db
    .select()
    .from(verificationTokens)
    .where(and(eq(verificationTokens.token, token), gt(verificationTokens.expires, new Date())));

  return record ? { valid: true, email: record.identifier } : { valid: false };
}

export async function resetPassword(token: string, newPassword: string) {
  const parsed = passwordSchema.safeParse(newPassword);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const check = await validateResetToken(token);
  if (!check.valid || !check.email) {
    return { error: 'El enlace es inválido o expiró. Solicita uno nuevo.' };
  }

  const hashedPassword = await bcrypt.hash(parsed.data, 10);

  await db.update(users).set({ password: hashedPassword }).where(eq(users.email, check.email));
  await db.delete(verificationTokens).where(eq(verificationTokens.token, token));

  return { success: true };
}