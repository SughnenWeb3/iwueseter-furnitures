import { withAuth } from "next-auth/middleware";

const authMiddleware = withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export default authMiddleware;
export { authMiddleware as proxy };

export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
