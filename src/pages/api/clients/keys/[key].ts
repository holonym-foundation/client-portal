import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { initializeMongoose } from "../../../../backend/database";
import { ProofClient } from "../../../../backend/models";
import { SALT } from "../../../../backend/constants";
import type { APIKey } from "../../../../types/types";

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  console.log("DELETE clients/keys/: Entered");
  const auth = req.headers["authorization"];

  if (!auth) {
    console.log("DELETE clients/keys/: Authorization header not provided");
    return res.status(400).json({ error: "Authorization header not provided" });
  }

  const [type, credentials] = auth.split(" ");
  if (type !== "Basic") {
    console.log("DELETE clients/keys/: Authorization type not supported");
    return res.status(400).json({ error: "Authorization type not supported" });
  }

  const decodedCredentials = Buffer.from(credentials, "base64").toString("ascii");
  const [username, password] = decodedCredentials.split(":");

  await initializeMongoose();

  const client = await ProofClient.findOne({
    username,
  }).exec();
  if (!client) {
    console.log("DELETE clients/keys/: Client not found");
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

  const { key } = req.query;
  console.log("apiKey", key);
  console.log("client apiKeys", client.apiKeys);
  const apiKeyIndex = client.apiKeys.findIndex((apiKey: APIKey) => apiKey.key === key);
  if (apiKeyIndex === -1) {
    console.log("DELETE clients/keys/: API key not found");
    return res.status(404).json({ error: "API key not found" });
  }
  client.apiKeys[apiKeyIndex].active = false;
  await client.save();

  console.log(`DELETE clients/keys/: API key revoked for client ${client.username}`);
  return res.status(200).json({ apiKey: client.apiKeys[apiKeyIndex] });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "DELETE") {
    return handleDelete(req, res);
  }
}
