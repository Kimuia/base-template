import { NextResponse } from 'next/server';

// Next.js 16: middleware → proxy (Node.js 런타임, Edge 미지원)
// Request는 표준 Web API 타입 (NextRequest 대체)
export function proxy(request: Request) {
  const url = new URL(request.url);
  const { pathname } = url;

  // TODO: 인증 체크 구현
  // const cookieHeader = request.headers.get('cookie') ?? '';
  // const hasSession = cookieHeader.includes('session=');
  // if (pathname.startsWith('/(private)') && !hasSession) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
