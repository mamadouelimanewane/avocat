
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const authToken = request.cookies.get('auth_token')?.value

    // 1. Logic for root path (/)
    if (path === '/') {
        if (authToken) {
            // User is logged in, redirect to Dashboard to "remove" landing page
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        // Guest user, show the Marketing Landing Page
        return NextResponse.next()
    }

    // 2. Standard Protection Logic
    const internalProtectedPaths = [
        '/dashboard',
        '/admin',
        '/clients',
        '/dossiers',
        '/comptabilite',
        '/agenda',
    ]

    const publicPaths = ['/login', '/portal/login', '/public']
    const isPublic = publicPaths.some(p => path.startsWith(p))
    const isInternalProtected = internalProtectedPaths.some(p => path === p || (p !== '/' && path.startsWith(p))) && !isPublic;

    if (isInternalProtected && !authToken) {
        const url = new URL('/login', request.url)
        url.searchParams.set('callbackUrl', path)
        return NextResponse.redirect(url)
    }

    // 3. Protect Portal Routes
    if (path.startsWith('/portal') && !path.startsWith('/portal/login')) {
        const portalToken = request.cookies.get('portal_token')?.value
        if (!portalToken) {
            const url = new URL('/portal/login', request.url)
            url.searchParams.set('callbackUrl', path)
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
