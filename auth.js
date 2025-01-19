import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { registerUser, getUserByEmail } from "./utils/db/action";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  pages: {
    signIn: "/landing",
  },
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;

      const protectedRoutes = [
        "/journal",
        "/explore",
        "/create",
        "/capsule",
        "/archived",
        "/",
      ];

      const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route),
      );

      if (isProtectedRoute) {
        return !!auth;
      }

      return true;
    },
    async signIn({ user }) {
      try {
        console.log("USER", user);
        const existingUser = await getUserByEmail(user.email);
        console.log("existingUser", existingUser);
        if (
          existingUser === undefined ||
          existingUser === null ||
          !existingUser ||
          existingUser.length === 0
        ) {
          console.log("User does not exist, adding user");
          await registerUser({
            email: user.email,
            name: user.name,
            profile: user.image,
          });
        }
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        throw new Error("Failed to execute database operations");
      }
    },
  },
});
