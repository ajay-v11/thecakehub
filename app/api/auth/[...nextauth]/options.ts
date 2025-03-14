import type {NextAuthOptions, User as NextAuthUser} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {prisma} from '@/lib/prisma';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt';

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
        email: {label: 'Email', type: 'email'},
        password: {label: 'Password', type: 'password'},
        username: {label: 'Name', type: 'text'},
      },
      async authorize(credentials): Promise<CustomUser | null> {
        if (!credentials?.email) {
          console.log('Missing email credential');
          return null;
        }

        try {
          // For login: email and password are required
          if (credentials.password && !credentials.username) {
            // This is a login attempt
            const user = await prisma.user.findUnique({
              where: {email: credentials.email},
            });

            if (!user || !user.password) {
              console.log('User not found or no password set');
              return null;
            }

            // Verify password
            const passwordMatch = await bcrypt.compare(
              credentials.password,
              user.password
            );

            if (!passwordMatch) {
              console.log('Password does not match');
              return null;
            }

            return {
              id: user.id,
              name: user.name!,
              email: user.email,
              isAdmin: user.isAdmin,
              image: user.image,
            };
          }
          // For signup: email, password, and username are required
          else if (credentials.password && credentials.username) {
            // This is a signup attempt
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
              where: {email: credentials.email},
            });

            if (existingUser && existingUser.password) {
              console.log('User already exists with password');
              return null;
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(credentials.password, 10);

            // Create or update the user
            const user = await prisma.user.upsert({
              where: {email: credentials.email},
              update: {
                name: credentials.username,
                password: hashedPassword,
              },
              create: {
                email: credentials.email,
                name: credentials.username,
                password: hashedPassword,
                isAdmin: false,
              },
            });

            return {
              id: user.id,
              name: user.name!,
              email: user.email,
              isAdmin: user.isAdmin,
              image: user.image,
            };
          } else {
            console.log('Invalid credential combination');
            return null;
          }
        } catch (error) {
          console.error('Authorization Error:', error);
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
