import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import bcrypt from "bcryptjs";
import { authOptions } from "../auth/[...nextauth]";
import { initializeMongoose } from "../../../backend/database";
import { ProofClient } from "../../../backend/models";
import { SALT } from "../../../backend/constants";

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  console.log("GET clients/change-password/: Entered");
  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    console.log(`GET clients/change-password/: User is not logged in`);
    return res.status(401).json({ error: "User is not logged in" });
  }

  if (session?.user?.role !== "client") {
    console.log(`GET clients/change-password/: User is not a client`);
    return res.status(401).json({ error: "User is not a client" });
  }

  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  if (!currentPassword || !newPassword) {
    console.log(
      `GET clients/change-password/: Current password and new password are required`
    );
    return res
      .status(400)
      .json({ error: "Current password and new password are required" });
  }

  await initializeMongoose();

  const client = await ProofClient.findOne({
    username: session?.user?.username,
  }).exec();
  if (!client) {
    return { error: "Client not found" };
  }

  const passwordIsCorrect = await bcrypt.compare(
    currentPassword,
    client.passwordDigest as string
  );
  if (!passwordIsCorrect) {
    return null;
  }

  const newPasswordDigest = await bcrypt.hash(newPassword, SALT);
  client.passwordDigest = newPasswordDigest;
  await client.save();

  console.log(
    `GET clients/change-password/: Client ${client.username} changed password`
  );
  return res.status(200).json({ success: true });
}
