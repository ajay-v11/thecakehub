import type {NextAuthOptions, User as NextAuthUser} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {prisma} from '@/lib/prisma';
import GoogleProvider from 'next-auth/providers/google';

// Custom User type to match NextAuth expectations
type CustomUser = NextAuthUser & {
  id: number;
  name: string;
  email: string;
  isAdmin: boolean;
  image?: string | null;
};

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent', // Always show consent screen
          access_type: 'offline', // Request refresh token
        },
      },
      async profile(profile): Promise<CustomUser> {
        console.log({
          GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING',
          GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
            ? 'SET'
            : 'MISSING',
        });
        const user = await prisma.user.upsert({
          where: {email: profile.email},
          update: {
            name: profile.name || profile.email.split('@')[0],
            image: profile.picture || null,
          },
          create: {
            email: profile.email,
            name: profile.name || profile.email.split('@')[0],
            image: profile.picture || null,
            isAdmin: false,
          },
        });

        return {
          id: user.id,
          name: user.name!,
          email: user.email,
          image: user.image,
          isAdmin: user.isAdmin,
        };
      },
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {label: 'Name', type: 'text'},
        email: {label: 'Email', type: 'text'},
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.email || !credentials?.username) {
          console.log('Missing credentials:', credentials);
          return null;
        }
        console.log('Credentials received:', credentials);

        try {
          const user = await prisma.user.upsert({
            where: {email: credentials.email},
            update: {name: credentials.username},
            create: {
              email: credentials.email,
              name: credentials.username,
              isAdmin: false,
            },
          });
          return {
            id: user.id,
            name: user.name!,
            email: user.email,
            isAdmin: user.isAdmin,
          };
        } catch (error) {
          console.error('Credentials Authorization Error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({token, user}) {
      if (user) {
        token.id = Number(user.id); // Ensure id is always a number
        token.name = user.name;
        token.email = user.email;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({session, token}) {
      session.user = {
        id: token.id as number, // Explicit cast to number
        name: token.name || '',
        email: token.email || '',
        isAdmin: token.isAdmin || false,
      };
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
};
