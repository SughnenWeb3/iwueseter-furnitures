import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

// Next.js 16 requires the function to be exported as "proxy"
export { auth as proxy };

export const config = {
  // Apply proxy to all routes except API, static assets, etc.
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$|.*\\.ico$).*)" ],
};
