'use server';

import { cookies } from 'next/headers';
import { db } from '@/db';
import { carts, cartItems, variants, products, productImages, brands } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

const CART_COOKIE = 'pg_decants_cart_id';

async function getOrCreateCart() {
  const session = await auth();
  const cookieStore = await cookies();

  if (session?.user?.id) {
    // Usuario logueado: busca su carrito, o crea uno
    let [cart] = await db.select().from(carts).where(eq(carts.userId, session.user.id));

    // Si tiene un carrito de invitado en la cookie, lo fusionamos
    const guestCartId = cookieStore.get(CART_COOKIE)?.value;
    if (guestCartId && guestCartId !== cart?.id) {
      const [guestCart] = await db.select().from(carts).where(eq(carts.id, guestCartId));
      if (guestCart && !guestCart.userId) {
        if (!cart) {
          // No tenía carrito propio: el carrito de invitado pasa a ser el suyo
          await db.update(carts).set({ userId: session.user.id }).where(eq(carts.id, guestCartId));
          cart = { ...guestCart, userId: session.user.id };
        } else {
          // Ya tenía carrito: fusiona los items del carrito de invitado al suyo
          const guestItems = await db.select().from(cartItems).where(eq(cartItems.cartId, guestCartId));
          for (const item of guestItems) {
            const [existing] = await db
              .select()
              .from(cartItems)
              .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.variantId, item.variantId)));
            if (existing) {
              await db
                .update(cartItems)
                .set({ quantity: existing.quantity + item.quantity })
                .where(eq(cartItems.id, existing.id));
            } else {
              await db.insert(cartItems).values({ cartId: cart.id, variantId: item.variantId, quantity: item.quantity });
            }
          }
          await db.delete(carts).where(eq(carts.id, guestCartId));
        }
        cookieStore.delete(CART_COOKIE);
      }
    }

    if (!cart) {
      const [newCart] = await db.insert(carts).values({ userId: session.user.id }).returning();
      cart = newCart;
    }

    return cart;
  }

  // Invitado: usa la cookie
  const guestCartId = cookieStore.get(CART_COOKIE)?.value;
  if (guestCartId) {
    const [cart] = await db.select().from(carts).where(eq(carts.id, guestCartId));
    if (cart) return cart;
  }

  const [newCart] = await db.insert(carts).values({}).returning();
  cookieStore.set(CART_COOKIE, newCart.id, { maxAge: 60 * 60 * 24 * 30, path: '/' });
  return newCart;
}

export async function addToCart(variantId: number, quantity: number = 1) {
  const cart = await getOrCreateCart();

  const [existing] = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.cartId, cart.id), eq(cartItems.variantId, variantId)));

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: existing.quantity + quantity })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({ cartId: cart.id, variantId, quantity });
  }

  revalidatePath('/');
  return { success: true };
}

export async function updateCartItemQuantity(itemId: number, quantity: number) {
  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, itemId));
  } else {
    await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, itemId));
  }
  revalidatePath('/');
  return { success: true };
}

export async function removeCartItem(itemId: number) {
  await db.delete(cartItems).where(eq(cartItems.id, itemId));
  revalidatePath('/');
  return { success: true };
}

export async function getCartContents() {
  const cart = await getOrCreateCart();

  const items = await db
    .select({
      id: cartItems.id,
      quantity: cartItems.quantity,
      variantId: variants.id,
      sizeMl: variants.sizeMl,
      price: variants.price,
      stock: variants.stock,
      productId: products.id,
      productName: products.name,
      productSlug: products.slug,
      brandName: brands.name,
    })
    .from(cartItems)
    .innerJoin(variants, eq(cartItems.variantId, variants.id))
    .innerJoin(products, eq(variants.productId, products.id))
    .innerJoin(brands, eq(products.brandId, brands.id))
    .where(eq(cartItems.cartId, cart.id));

  const itemsWithImages = await Promise.all(
    items.map(async (item) => {
      const [image] = await db
        .select({ imageUrl: productImages.imageUrl })
        .from(productImages)
        .where(and(eq(productImages.productId, item.productId), eq(productImages.isMain, true)))
        .limit(1);
      return { ...item, image: image?.imageUrl ?? '' };
    })
  );

  const total = itemsWithImages.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const itemCount = itemsWithImages.reduce((sum, item) => sum + item.quantity, 0);

  return { items: itemsWithImages, total, itemCount };
}