import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { initializeMongoose } from "../../../backend/database";
import { ProofClient } from "../../../backend/models";

export const authOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Holonym Client Portal",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "username" },
        password: { label: "Password", type: "password", placeholder: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        await initializeMongoose();

        const client = await ProofClient.findOne({
          username: credentials.username,
        }).exec();

        const passwordIsCorrect = await bcrypt.compare(
          credentials.password,
          client.passwordDigest as string
        );
        if (!passwordIsCorrect) {
          return null;
        }

        if (client) {
          const user = {
            displayName: client.displayName,
            username: client.username,
            clientId: client.clientId,
          };
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, user, token }) {
      session.user = token.user;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  // TODO: Add custom signin page
};
export default NextAuth(authOptions);
