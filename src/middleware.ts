import { getSession, unSetSession } from '@/lib/Session';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
    matcher: ['/dashboard', '/verify', '/api/protected/:path*'],
};

export async function middleware(request: NextRequest) {
    const userData = getSession();
    if (userData.tokenExpiry == null || new Date(userData.tokenExpiry) < new Date()) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}