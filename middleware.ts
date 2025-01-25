import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {getToken} from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({req, secret: process.env.NEXTAUTH_SECRET});
  console.log('Token role:', token?.isAdmin);

  // Check if route starts with /admin and user is not an admin
  if (
    req.nextUrl.pathname.startsWith('/admin') &&
    (!token || token.isAdmin !== true)
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }
}

export const config = {
  matcher: '/admin/:path*',
};
