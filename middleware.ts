
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const authToken = request.cookies.get('auth_token')?.value

    // 1. Root Path Logic
    // We let app/page.tsx handle the branching (Landing vs Dashboard) 
    // to avoid complex redirect loops.
    if (path === '/') {
        return NextResponse.next()
    }

    // 2. Standard Internal Protection
    const internalProtectedPaths = [
        '/dashboard',
        '/admin',
        '/clients',
        '/dossiers',
        '/comptabilite',
        '/agenda',
    ]

    const publicPaths = ['/login', '/portal/login', '/public']
    const isPublic = publicPaths.some(p => path === p || path.startsWith('/public'))
    const isInternalProtected = internalProtectedPaths.some(p => path === p || path.startsWith(p)) && !isPublic;

    if (isInternalProtected && !authToken) {
        const url = new URL('/login', request.url)
        url.searchParams.set('callbackUrl', path)
        return NextResponse.redirect(url)
    }

    // 3. Portal Routes Protection
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
