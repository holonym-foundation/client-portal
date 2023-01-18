import type { NextApiRequest, NextApiResponse } from "next";
import { clientBasicAuth } from "../../../backend/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  console.log("GET clients/auth: Entered");
  const authResult = await clientBasicAuth(req);
  if (authResult?.error) {
    console.log(`GET clients/auth: ${authResult.error}`);
    return res.status(401).json({ error: authResult.error });
  }

  const client = authResult.client;

  console.log(`GET clients/auth: Client ${client.username} logged in`);
  return res.status(200).json({ data: "Login successful" });
}
