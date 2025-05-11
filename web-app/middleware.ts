import { NextResponse, NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/api')) {
    console.log('middleware intercepting:', request.nextUrl.pathname)
    if (request.nextUrl.origin === 'http://localhost:3000') {
      console.log('localhost')
      return NextResponse.rewrite(new URL(request.nextUrl.pathname, 'http://127.0.0.1:5000'))
    } else {
      return NextResponse.rewrite(new URL(request.nextUrl.pathname, 'https://ai-agent-interviewer-test.vercel.app/'))
    }
  }
}
 
export const config = {
  matcher: '/api/:path*',
}
 