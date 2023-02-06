// import "next-auth/jwt";
// import "next-auth";
import NextAuth, { Session, DefaultUser } from "next-auth";

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

// declare module "next-auth/jwt" {
declare module "next-auth" {
  interface User extends DefaultUser {
    username?: string;
    role?: "admin" | "client";
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
