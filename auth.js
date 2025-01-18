import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
// import {getUserByEmail, createUser} from './utils/db/actions.js';
// import { getUserByEmail, createUser } from "@/utils/db/action.js";



export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ users }) {
      try {
        console.log("USER", users);
        // Attempt to get the user by email
        const existingUser = await getUserByEmail(users.email);
        console.log("existingUser", existingUser);
        if (
          existingUser === undefined ||
          existingUser === null ||
          !existingUser ||
          existingUser.length === 0
        ) {
          console.log("User does not exist, adding user");
          await createUser(users.email, users.name, users.image);
        }
        // Return true to continue the sign-in process
        return true;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        throw new Error("Failed to execute database operations");
      }
    },
  },
});