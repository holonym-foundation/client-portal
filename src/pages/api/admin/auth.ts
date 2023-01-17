// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  // TODO: Rewrite this using NextAuth
  console.log("GET /admin/auth: Entered");
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    console.log("GET /admin/auth: API key not provided");
    return res.status(400).json({ error: "API key not provided" });
  }

  if (apiKey != process.env.ADMIN_API_KEY) {
    console.log("admin", process.env.ADMIN_API_KEY);
    console.log("GET /admin/auth: API key not valid");
    return res.status(401).json({ error: "API key not valid" });
  }

  console.log("GET /admin/auth: Login successful");
  return res.status(200).json({ data: "Login successful" });
}
