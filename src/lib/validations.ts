import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(150, 'El nombre es demasiado largo'),
  email: z
    .string()
    .trim()
    .email('Ingresa un correo electrónico válido'),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?56)?9\d{8}$/, 'Ingresa un celular chileno válido (ej: 912345678)'),
  street: z
    .string()
    .trim()
    .min(5, 'Ingresa una dirección completa'),
  city: z
    .string()
    .trim()
    .min(2, 'Ingresa tu comuna'),
  region: z
    .string()
    .trim()
    .min(2, 'Ingresa tu región'),
  postalCode: z
    .string()
    .trim()
    .optional(),
});

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Ingresa tu nombre'),
  email: z
    .string()
    .trim()
    .email('Ingresa un correo electrónico válido'),
  message: z
    .string()
    .trim()
    .min(10, 'Tu mensaje debe tener al menos 10 caracteres')
    .max(2000, 'Tu mensaje es demasiado largo'),
});

export const perfumeRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Ingresa tu nombre'),
  email: z
    .string()
    .trim()
    .email('Ingresa un correo electrónico válido'),
  perfumeName: z
    .string()
    .trim()
    .min(2, 'Ingresa el nombre del perfume que buscas'),
  notes: z
    .string()
    .trim()
    .optional(),
});

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Ingresa tu nombre completo'),
  email: z
    .string()
    .trim()
    .email('Ingresa un correo electrónico válido'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(100, 'La contraseña es demasiado larga'),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email('Ingresa un correo electrónico válido'),
  password: z
    .string()
    .min(1, 'Ingresa tu contraseña'),
});