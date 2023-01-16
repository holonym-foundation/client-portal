// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { startOfMonth, subMonths } from "date-fns";
import { ProofClient, ProofSession } from "../../../../backend/init";
import type { ProofClientDoc } from "../../../../types/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  console.log("GET /admin/client: Entered");
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    console.log("GET /admin/client: API key not provided");
    return res.status(400).json({ error: "API key not provided" });
  }

  if (apiKey != process.env.ADMIN_API_KEY) {
    console.log("GET /admin/client: API key not valid");
    return res.status(401).json({ error: "API key not valid" });
  }

  const { clientId } = req.query;

  const result = await ProofClient.findOne({ clientId: clientId });
  const client: Partial<ProofClientDoc> | undefined = result?.toObject();
  if (!client) {
    console.log("GET /admin/client: Client not found");
    return res.status(404).json({ error: "Client not found" });
  }

  delete client._id;
  delete client.__v;
  delete client.apiKeys;
  delete client.passwordDigest;

  return res.status(200).json(client);
}
