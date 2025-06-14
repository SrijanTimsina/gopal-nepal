import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  // Check if the path is an admin path
  const isAdminPath = path.startsWith("/admin") && path !== "/admin/login"

  if (isAdminPath) {
    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    })

    // Redirect to login if not authenticated or not an admin
    if (!session || session.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}

