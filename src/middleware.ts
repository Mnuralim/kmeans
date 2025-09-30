import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "./actions/session";

const adminProtectedRoutes = [
  "/",
  "/students",
  "/education-fee",
  "/clusters",
  "/payments",
  "/reports",
  "/clustering",
  "/results",
  "/settings",
];
const adminPublicRoutes = ["/login"];
const headMasterProtectedRoutes = ["/", "/reports", "/results", "/settings"];
const headMasterPublicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isAdminProtected = adminProtectedRoutes.includes(path);
  const isAdminPublic = adminPublicRoutes.includes(path);
  const isHeadMasterProtected = headMasterProtectedRoutes.includes(path);
  const isHeadMasterPublic = headMasterPublicRoutes.includes(path);

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", path);
  requestHeaders.set("x-url", req.nextUrl.href);

  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (isAdminProtected || isHeadMasterProtected) {
    if (!session?.userId) {
      return NextResponse.redirect(new URL("/login", req.nextUrl));
    } else {
      if (session.role === "HEAD_MASTER" && !isHeadMasterProtected) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
      }
      if (session.role === "ADMIN" && !isAdminProtected) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
      }
    }
  }
  if ((isAdminPublic || isHeadMasterPublic) && session?.userId) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
};
