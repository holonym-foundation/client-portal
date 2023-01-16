import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidV4 } from "uuid";
import { ProofClient, ProofSession } from "../../../backend/init";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  console.log("POST sessions/: Entered");
  const apiKey = req.headers["x-api-key"];

  const client = await ProofClient.findOne({
    apiKeys: { $elemMatch: { key: apiKey, active: true } },
  }).exec();
  if (!client) {
    console.log("POST sessions/: Client not found");
    return res.status(401).json({ error: "Client not found" });
  }

  const sessionId = uuidV4();
  const proofSession = new ProofSession({
    sessionId,
    clientId: client.clientId,
    createdAt: new Date().getTime(),
  });
  await proofSession.save();

  console.log(`POST sessions/: Created session with sessionId ${sessionId}`);

  // TODO: Include client's public encryption key in response so that frontend
  // can encrypt (at least part of) proof before sending it to the client

  return res.status(200).json({ sessionId });
}
