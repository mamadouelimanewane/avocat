
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // 1. Protect Admin / Internal Routes
    // List of paths that require internal staff authentication
    const internalProtectedPaths = [
        '/',
        '/admin',
        '/clients',
        '/dossiers',
        '/comptabilite',
        '/agenda',
    ]

    const publicPaths = ['/login', '/portal/login', '/public']
    const isPublic = publicPaths.some(p => path.startsWith(p))
    const isInternalProtected = internalProtectedPaths.some(p => path === p || (p !== '/' && path.startsWith(p))) && !isPublic;

    // For Demo purposes, we check a mock cookie 'auth_token'. 
    // In production, this would be a real JWT verification.
    const authToken = request.cookies.get('auth_token')?.value

    if (isInternalProtected && !authToken) {
        // Redirect to internal login
        const url = new URL('/login', request.url)
        url.searchParams.set('callbackUrl', path)
        return NextResponse.redirect(url)
    }

    // 2. Protect Portal Routes
    if (path.startsWith('/portal') && !path.startsWith('/portal/login')) {
        const portalToken = request.cookies.get('portal_token')?.value
        if (!portalToken) {
            // Redirect to portal login
            const url = new URL('/portal/login', request.url)
            url.searchParams.set('callbackUrl', path)
            return NextResponse.redirect(url)
        }
    }

    // 3. Admin Only Routes
    if (path.startsWith('/admin')) {
        // In real app, we decode the token to check role. 
        // Here we assume if they have auth_token they are staff.
        // We could add a specific cookie 'user_role' = 'ADMIN' for strict check.
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
