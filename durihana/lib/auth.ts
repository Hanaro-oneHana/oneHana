import NextAuth, { User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { findPartnerId } from './actions/AuthActions';

declare module 'next-auth' {
  interface User {
    partnerId: number;
    isMain: boolean;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
} = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        id: { label: 'ID', type: 'text' },
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        partnerCode: { label: 'Partner ID', type: 'text' },
      },
      async authorize(credentials) {
        const id = credentials?.id as string;
        const email = credentials?.email as string;
        const password = credentials?.password as string;
        const name = credentials?.name as string;
        const partnerId = await findPartnerId(
          credentials?.partnerCode as string
        );

        if (!id || !email || !password || !partnerId.isSuccess) return null;

        return {
          id,
          email,
          name: name || '',
          partnerId: partnerId.data || 0,
          isMain: parseInt(id) > (partnerId.data || 0),
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.partnerCode = user.partnerId;
        token.isMain = user.isMain;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.partnerId = token.partnerCode as number;
        session.user.isMain = token.isMain as boolean;
      }
      return session;
    },
  },
});
