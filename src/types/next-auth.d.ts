// import "next-auth/jwt";
// import "next-auth";
import NextAuth, { Session, DefaultUser } from "next-auth";

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

// declare module "next-auth/jwt" {
declare module "next-auth" {
  type Role = "admin" | "client";
  interface User extends DefaultUser {
    // NOTE: user.id and proofClient.clientId are the same
    username?: string;
    role?: Role;
    displayName?: string;
  }
  interface JWT {
    user: User;
  }
  interface Session {
    user?: User;
    expires: ISODateString;
  }
}
