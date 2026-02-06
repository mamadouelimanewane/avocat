import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Portal Routes
    if (pathname.startsWith('/portal')) {
        const clientCookie = request.cookies.get("client_access")
        const isPortalLogin = pathname === "/portal/login"

        if (!clientCookie && !isPortalLogin) {
            return NextResponse.redirect(new URL("/portal/login", request.url))
        }

        if (clientCookie && isPortalLogin) {
            return NextResponse.redirect(new URL("/portal", request.url))
        }

        return NextResponse.next()
    }

    // Lawyer Routes
    const authCookie = request.cookies.get("auth")
    const isLoginPage = pathname === "/login"

    if (!authCookie && !isLoginPage) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    if (authCookie && isLoginPage) {
        return NextResponse.redirect(new URL("/", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|visual_demo.png|demo_video.webp).*)",
    ],
}
