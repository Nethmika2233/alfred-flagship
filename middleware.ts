import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const userRole = req.auth?.user?.role

  // 1. Target Area Definitions
  const isAdminRoute = pathname.startsWith("/admin")
  const isSellerRoute = pathname.startsWith("/seller")
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup")

  // Case A: User is on an auth page but already logged in -> redirect based on role
  if (isAuthRoute && isLoggedIn) {
    if (userRole === "ADMIN") return NextResponse.redirect(new URL("/admin/dashboard", req.url))
    if (userRole === "SELLER") return NextResponse.redirect(new URL("/seller/dashboard", req.url))
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Case B: User tries to access protected areas without authenticating
  if ((isAdminRoute || isSellerRoute) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Case C: Regular logged-in customer attempts to access Admin control hubs
  if (isAdminRoute && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // Case D: Regular customer or admin attempts to access Seller workspace profiles
  if (isSellerRoute && userRole !== "SELLER") {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
})

// Configure our middleware matcher arrays to look across application routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}