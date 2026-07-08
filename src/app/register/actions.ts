'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/lib/validations';

export async function registerUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const parsed = registerSchema.safeParse({ name, email, password });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const [existing] = await db.select().from(users).where(eq(users.email, parsed.data.email));
  if (existing) {
    return { error: 'Ya existe una cuenta con este correo.' };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

  await db.insert(users).values({
    name: parsed.data.name,
    email: parsed.data.email,
    password: hashedPassword,
  });

  return { success: true };
}