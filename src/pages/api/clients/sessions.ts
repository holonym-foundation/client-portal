import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { initializeMongoose } from "../../../backend/database";
import { ProofClient, ProofSession } from "../../../backend/models";
import { SALT } from "../../../backend/constants";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  console.log("GET proof-clients/sessions/: Entered");
  const auth = req.headers["authorization"];

  if (!auth) {
    console.log("GET proof-clients/sessions/: Authorization header not provided");
    return res.status(400).json({ error: "Authorization header not provided" });
  }

  const [type, credentials] = auth.split(" ");
  if (type !== "Basic") {
    console.log("GET proof-clients/sessions/: Authorization type not supported");
    return res.status(400).json({ error: "Authorization type not supported" });
  }

  const decodedCredentials = Buffer.from(credentials, "base64").toString("ascii");
  const [username, password] = decodedCredentials.split(":");

  await initializeMongoose();

  const client = await ProofClient.findOne({
    username,
  }).exec();
  if (!client) {
    console.log("GET proof-clients/sessions/: Client not found");
    return res.status(401).json({ error: "Client not found" });
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    client.passwordDigest as string
  );
  if (!isPasswordCorrect) {
    console.log("GET clients/auth: Password not correct");
    return res.status(401).json({ error: "Password not correct" });
  }

  const sessions = await ProofSession.find({ clientId: client.clientId }).exec();

  console.log(`GET proof-clients/sessions/: Client ${client.username} found`);
  return res.status(200).json({ username: client.username, sessions: sessions });
}
