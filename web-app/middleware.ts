import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    if (request.nextUrl.origin === 'http://localhost:3000') {
      return NextResponse.rewrite(new URL(request.nextUrl.pathname, 'http://127.0.0.1:5000'))
    } else {
      return NextResponse.rewrite(new URL(request.nextUrl.pathname, 'https://ai-agent-interviewer-test.onrender.com'))
    }
  }
}
 
export const config = {
  matcher: '/api/:path*',
}
 