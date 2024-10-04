import { initialAuthState } from './providers/AuthProvider';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
    matcher: ['/api/protected/:path*'],
};

export async function middleware(request: NextRequest) {
    try {
        const user = request.headers.get('authorization');
        let userData = initialAuthState;
        if (user !== null) {
            userData = JSON.parse(user);
        }
        if (!userData || userData?.userName === '' || userData?.userToken == 0 || userData?.tokenExpiry === null || new Date(userData?.tokenExpiry) < new Date()) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    } catch (error) {
        console.log('Error occured on middleware :' + error);
        return NextResponse.redirect(new URL('/login', request.url));
    }
}