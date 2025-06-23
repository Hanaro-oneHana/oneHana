import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    // 로그인 안 된 사용자 → 로그인 유도페이지로 리디렉트
    return NextResponse.redirect(new URL('/auth/unauthorized', request.url));
  }

  // 로그인된 사용자면 통과
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/calendar/:path*',
    '/account/:path*',
    '/asset',
    '/estimate/:path*',
    '/invite-code/:path*',
    '/wedding-bucket/:path*',
    '/my',
  ],
};
