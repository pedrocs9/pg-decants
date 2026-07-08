'use server';

import { db } from '@/db';
import { olfactoryNotes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getNotes() {
  return db.select().from(olfactoryNotes).orderBy(olfactoryNotes.name);
}

export async function createNote(name: string) {
  await db.insert(olfactoryNotes).values({ name });
  revalidatePath('/admin/notas');
}

export async function deleteNote(id: number) {
  await db.delete(olfactoryNotes).where(eq(olfactoryNotes.id, id));
  revalidatePath('/admin/notas');
}