import type { NextApiRequest, NextApiResponse } from "next";
import { createHash } from "crypto";
import { v4 as uuidV4 } from "uuid";
import { ProofClient } from "../../../../backend/init";
import { SALT, MAX_CLIENT_API_KEYS } from "../../../../backend/constants";
import type { APIKey } from "../../../../types/types";

const hash = (data: Buffer) =>
  createHash("sha256").update(data).digest().toString("hex");

async function handlePost(req: NextApiRequest, res: NextApiResponse<any>) {
  console.log("POST clients/keys/: Entered");
  const auth = req.headers["authorization"];

  if (!auth) {
    console.log("POST clients/keys/: Authorization header not provided");
    return res.status(400).json({ error: "Authorization header not provided" });
  }

  const [type, credentials] = auth.split(" ");
  if (type !== "Basic") {
    console.log("POST clients/keys/: Authorization type not supported");
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
    console.log("POST clients/keys/: Client not found");
    return res.status(401).json({ error: "Client not found" });
  }

  if (
    client.apiKeys.filter((key: APIKey) => !key.active).length >= MAX_CLIENT_API_KEYS
  ) {
    console.log(
      `POST clients/keys/: Client ${client.username} has reached maximum number of active API keys`
    );
    return res.status(400).json({
      error:
        "Maximum number of active API keys reached. Please revoke an API key before adding another one.",
    });
  }

  const newApiKey = { key: `HOLO${uuidV4()}NYM`, active: true };
  client.apiKeys.push(newApiKey);
  await client.save();

  console.log(`POST clients/keys/: API key created for client ${client.username}`);
  return res.status(200).json({ apiKey: newApiKey });
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  console.log("GET clients/keys/: Entered");
  const auth = req.headers["authorization"];

  if (!auth) {
    console.log("GET clients/keys/: Authorization header not provided");
    return res.status(400).json({ error: "Authorization header not provided" });
  }

  const [type, credentials] = auth.split(" ");
  if (type !== "Basic") {
    console.log("GET clients/keys/: Authorization type not supported");
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
    console.log("GET clients/keys/: Client not found");
    return res.status(401).json({ error: "Client not found" });
  }

  console.log(`GET clients/keys/: Client ${client.username} found`);
  return res.status(200).json({ username: client.username, apiKeys: client.apiKeys });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "GET") {
    return handleGet(req, res);
  }
  if (req.method == "POST") {
    return handlePost(req, res);
  }
}
