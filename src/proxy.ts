import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isSupabaseConfigured } from "@/lib/config";
import { DEMO_ADMIN_COOKIE } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";

  if (!isSupabaseConfigured()) {
    if (isAdminRoute && request.cookies.get(DEMO_ADMIN_COOKIE)?.value !== "1") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    return NextResponse.next();
  }

  const { response, user } = await updateSession(request);

  if (isAdminRoute && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
