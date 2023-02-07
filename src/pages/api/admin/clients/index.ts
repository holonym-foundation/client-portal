// TODO: Handle POST request to create a new client

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { startOfMonth, subMonths } from "date-fns";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { authOptions } from "../../auth/[...nextauth]";
import { initializeMongoose } from "../../../../backend/database";
import { ProofClient, ProofSession } from "../../../../backend/models";
import type { ProofClientDoc } from "../../../../types/types";
import { SALT } from "../../../../backend/constants";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  console.log("POST /admin/client: Entered");

  if (req.method !== "POST") {
    console.log(`POST /admin/client: Method not allowed`);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    console.log(`POST admin/sessions/: Admin is not logged in`);
    return res.status(401).json({ error: "Admin is not logged in" });
  }

  if (session?.user?.role !== "admin") {
    console.log(`POST admin/sessions/: User is not an admin`);
    return res.status(401).json({ error: "User is not an admin" });
  }

  // old auth method. Maybe authenticate this way too, in case admin wants to use API outside of webapp
  // const apiKey = req.headers["x-api-key"];
  // if (!apiKey) {
  //   console.log("GET /admin/client: API key not provided");
  //   return res.status(400).json({ error: "API key not provided" });
  // }
  // if (apiKey != process.env.ADMIN_API_KEY) {
  //   console.log("GET /admin/client: API key not valid");
  //   return res.status(401).json({ error: "API key not valid" });
  // }

  const username = req.body?.username;

  await initializeMongoose();

  const existingClient = await ProofClient.findOne({ username: username });
  if (existingClient) {
    console.log(`POST /admin/client: Client with username ${username} already exists`);
    return res
      .status(404)
      .json({ error: `Client with username ${username} already exists` });
  }

  const password = uuidv4().slice(0, 13);
  const passwordDigest = await bcrypt.hash(password, SALT);

  const clientData = {
    username: username,
    displayName: username,
    passwordDigest: passwordDigest,
    clientId: uuidv4(),
    apiKeys: [{ key: uuidv4(), active: true }],
  };
  const client = new ProofClient(clientData);
  await client.save();

  console.log(`POST /admin/client: Client ${username} created`);
  return res.status(201).json({ ...clientData, password: password });
}
