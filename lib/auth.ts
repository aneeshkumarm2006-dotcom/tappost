import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/lib/mongodb/connect';
import Bar from '@/lib/models/Bar';

// ─── NextAuth Configuration ───────────────────────────────────────────────────

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required.');
        }

        await connectToDatabase();

        // Find bar — include passwordHash explicitly (it has select: false)
        const bar = await Bar.findOne(
          { userId: credentials.email.toLowerCase() }
        ).select('+passwordHash').lean() as (Record<string, unknown>) | null;

        if (!bar) {
          throw new Error('No account found with that email address.');
        }

        const hash = bar.passwordHash as string | undefined;

        if (!hash) {
          throw new Error('Invalid account configuration.');
        }

        const isValid = await bcrypt.compare(credentials.password, hash);

        if (!isValid) {
          throw new Error('Incorrect password.');
        }

        const subscription = bar.subscription as {
          tier: string;
          status: string;
          trialEndsAt?: Date;
        } | undefined;

        return {
          id: (bar._id as { toString(): string }).toString(),
          email: credentials.email.toLowerCase(),
          name: bar.name as string,
          // Extra fields for middleware subscription gate
          subscriptionTier: subscription?.tier ?? 'trial',
          subscriptionStatus: subscription?.status ?? 'active',
          trialEndsAt: subscription?.trialEndsAt
            ? new Date(subscription.trialEndsAt).getTime()
            : null,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
        token.email = user.email;
        token.name = user.name;
        // Subscription fields for middleware — use double cast via unknown
        const u = (user as unknown) as Record<string, unknown>;
        token.subscriptionTier = u.subscriptionTier;
        token.subscriptionStatus = u.subscriptionStatus;
        token.trialEndsAt = u.trialEndsAt;
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        (session.user as Record<string, unknown>).id = token.userId as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
