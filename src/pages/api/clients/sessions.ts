import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { initializeMongoose } from "../../../backend/database";
import { ProofClient } from "../../../backend/models";
import { ProofSession } from "../../../backend/models";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  console.log("GET clients/sessions/: Entered");
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    console.log(`GET clients/sessions/: User is not logged in`);
    return res.status(401).json({ error: "User is not logged in" });
  }

  await initializeMongoose();

  const client = await ProofClient.findOne({
    username: session?.user?.username,
  }).exec();
  if (!client) {
    return { error: "Client not found" };
  }

  // TODO: Implement pagination
  const sessions = await ProofSession.find({ clientId: client.clientId }).exec();

  console.log(`GET clients/sessions/: Client ${client.username} found`);
  return res.status(200).json({ username: client.username, sessions: sessions });
}
