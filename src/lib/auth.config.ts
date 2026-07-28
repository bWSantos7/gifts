import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isAdminRoute =
        request.nextUrl.pathname.startsWith("/admin") &&
        request.nextUrl.pathname !== "/admin/login";
      const isAdminApiRoute = request.nextUrl.pathname.startsWith("/api/admin");
      if (isAdminRoute || isAdminApiRoute) return !!auth;
      return true;
    },
  },
} satisfies NextAuthConfig;
