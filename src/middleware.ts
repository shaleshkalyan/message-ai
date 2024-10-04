import { NextRequest, NextResponse } from 'next/server';

export const config = {
    matcher: ['/dashboard', '/api/protected/:path*'],
};

export async function middleware(request: NextRequest) {
    try {
        const userName = request.headers.get('userName');
        const tokenExpiry = request.headers.get('tokenExpiry');
        const userToken = request.headers.get('userToken');
        if (userName === '' || userToken == '0' || tokenExpiry === null || new Date(tokenExpiry) < new Date()) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    } catch (error) {
        console.log('Error occured on middleware :' + error);
        return NextResponse.redirect(new URL('/login', request.url));
    }
}