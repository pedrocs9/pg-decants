import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/db';
import { users, accounts, sessionsTable, verificationTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessionsTable,
    verificationTokensTable: verificationTokens,
  }),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
        authorization: {
            params: {
            prompt: 'select_account',
            },
        },
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string));

        if (!user || !user.password) return null;

        const passwordMatch = await bcrypt.compare(credentials.password as string, user.password);
        if (!passwordMatch) return null;

        return { id: user.id, name: user.name, email: user.email, image: user.image };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
    callbacks: {
        async jwt({ token, user }) {
        if (user) {
            token.id = user.id;
            const [dbUser] = await db.select().from(users).where(eq(users.id, user.id!));
            token.role = dbUser?.role ?? 'customer';
        }
        return token;
        },
        async session({ session, token }) {
        if (session.user && token.id) {
            session.user.id = token.id as string;
            session.user.role = token.role as 'admin' | 'customer';
        }
        return session;
        },
    },
});