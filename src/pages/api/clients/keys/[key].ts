import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { initializeMongoose } from "../../../../backend/database";
import { ProofClient } from "../../../../backend/models";
import type { APIKey } from "../../../../types/types";

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  console.log("DELETE clients/keys/: Entered");
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    console.log(`DELETE clients/keys/: User is not logged in`);
    return res.status(401).json({ error: "User is not logged in" });
  }

  await initializeMongoose();

  const client = await ProofClient.findOne({
    username: session?.user?.username,
  }).exec();
  if (!client) {
    return { error: "Client not found" };
  }

  const { key } = req.query;

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
