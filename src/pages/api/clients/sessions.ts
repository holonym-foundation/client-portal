import type { NextApiRequest, NextApiResponse } from "next";
import { clientBasicAuth } from "../../../backend/utils";
import { ProofSession } from "../../../backend/models";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  console.log("GET proof-clients/sessions/: Entered");
  const authResult = await clientBasicAuth(req);
  if (authResult?.error) {
    console.log(`GET proof-clients/sessions/: ${authResult.error}`);
    return res.status(401).json({ error: authResult.error });
  }

  const client = authResult.client;

  const sessions = await ProofSession.find({ clientId: client.clientId }).exec();

  console.log(`GET proof-clients/sessions/: Client ${client.username} found`);
  return res.status(200).json({ username: client.username, sessions: sessions });
}
