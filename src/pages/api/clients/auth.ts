import type { NextApiRequest, NextApiResponse } from "next";
import { createHash } from "crypto";
import { ProofClient } from "../../../backend/init";
import { SALT } from "../../../backend/constants";

const hash = (data: Buffer) =>
  createHash("sha256").update(data).digest().toString("hex");

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  console.log("GET clients/auth: Entered");
  const auth = req.headers["authorization"];

  if (!auth) {
    console.log("GET clients/auth: Authorization header not provided");
    return res.status(400).json({ error: "Authorization header not provided" });
  }

  const [type, credentials] = auth.split(" ");
  if (type !== "Basic") {
    console.log("GET clients/auth: Authorization type not supported");
    return res.status(400).json({ error: "Authorization type not supported" });
  }

  const decodedCredentials = Buffer.from(credentials, "base64").toString("ascii");
  const [username, password] = decodedCredentials.split(":");
  const passwordDigest = hash(Buffer.from(password + SALT, "utf8"));

  const client = await ProofClient.findOne({
    username,
    passwordDigest,
  }).exec();
  if (!client) {
    console.log("GET clients/auth: Client not found");
    return res.status(401).json({ error: "Client not found" });
  }

  console.log(`GET clients/auth: Client ${username} logged in`);
  return res.status(200).json({ data: "Login successful" });
}
