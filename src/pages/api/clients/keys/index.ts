import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidV4 } from "uuid";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { initializeMongoose } from "../../../../backend/database";
import { ProofClient } from "../../../../backend/models";
import { MAX_CLIENT_API_KEYS } from "../../../../backend/constants";
import type { APIKey } from "../../../../types/types";

async function handlePost(req: NextApiRequest, res: NextApiResponse<any>) {
  console.log("POST clients/keys/: Entered");
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    console.log(`POST clients/keys/: User is not logged in`);
    return res.status(401).json({ error: "User is not logged in" });
  }

  await initializeMongoose();

  const client = await ProofClient.findOne({
    username: session?.user?.username,
  }).exec();
  if (!client) {
    return { error: "Client not found" };
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
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    console.log(`GET clients/keys/: User is not logged in`);
    return res.status(401).json({ error: "User is not logged in" });
  }

  await initializeMongoose();

  const client = await ProofClient.findOne({
    username: session?.user?.username,
  }).exec();
  if (!client) {
    return { error: "Client not found" };
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
