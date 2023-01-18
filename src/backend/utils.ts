import type { NextApiRequest } from "next";
import bcrypt from "bcryptjs";
import { initializeMongoose } from "./database";
import { ProofClient } from "./models";

/**
 * Basic authentication method for protected proof client endpoints.
 */
export async function clientBasicAuth(req: NextApiRequest) {
  const auth = req.headers["authorization"];

  if (!auth) {
    return { error: "Authorization header not provided" };
  }

  const [type, credentials] = auth.split(" ");
  if (type !== "Basic") {
    return { error: "Authorization type not supported" };
  }

  const decodedCredentials = Buffer.from(credentials, "base64").toString("ascii");
  const [username, password] = decodedCredentials.split(":");

  await initializeMongoose();

  const client = await ProofClient.findOne({
    username,
  }).exec();
  if (!client) {
    return { error: "Client not found" };
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    client.passwordDigest as string
  );
  if (!isPasswordCorrect) {
    return { error: "Password not correct" };
  }

  return { client };
}
