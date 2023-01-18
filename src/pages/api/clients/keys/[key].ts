import type { NextApiRequest, NextApiResponse } from "next";
import { clientBasicAuth } from "../../../../backend/utils";
import type { APIKey } from "../../../../types/types";

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  console.log("DELETE clients/keys/: Entered");
  const authResult = await clientBasicAuth(req);
  if (authResult?.error) {
    console.log(`DELETE clients/keys/: ${authResult.error}`);
    return res.status(401).json({ error: authResult.error });
  }

  const client = authResult.client;

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
