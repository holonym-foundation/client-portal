import { NextApiRequest, NextApiResponse } from "next";
import { ProofSession } from "../../../backend/init.js";
import { PROOF_SESSION_ACTIVE_DURATION } from "../../../backend/constants.js";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("GET sessions/<sessionId>: Entered");

  const { sessionId } = req.query;
  if (!sessionId) {
    console.log("GET sessions/<sessionId>: Session ID not provided");
    return res.status(400).json({ error: "Session ID not provided" });
  }

  const ipAddr =
    (req.headers["x-forwarded-for"] as string) || req.socket.remoteAddress;

  const session = await ProofSession.findOne({ sessionId }).exec();
  if (!session) {
    console.log(`GET sessions/<sessionId>: Session ${sessionId} not found`);
    return res.status(404).json({ error: "Session not found" });
  }
  if (!session.consumedAt) {
    const consumedAt = new Date().getTime();
    console.log(
      `GET sessions/<sessionId>: Session ${sessionId} being consumed by ${ipAddr}`
    );
    session.consumedAt = consumedAt;
    session.consumedBy = ipAddr;
    await session.save();
    return res.status(200).json({ sessionId });
  }
  if (session.consumedAt + PROOF_SESSION_ACTIVE_DURATION > new Date().getTime()) {
    if (session.consumedBy !== ipAddr) {
      // TODO: Will this work if users are using VPN services?
      console.log(
        `GET sessions/<sessionId>: Session ${sessionId} is in use by another IP`
      );
      return res.status(401).json({ error: "Session belongs to another user" });
    }
    console.log(`GET sessions/<sessionId>: Session ${sessionId} is in use`);
    return res.status(200).json({ sessionId });
  }
  if (session.consumedAt + PROOF_SESSION_ACTIVE_DURATION < new Date().getTime()) {
    console.log(`GET sessions/<sessionId>: Session ${sessionId} expired`);
    return res.status(401).json({ error: "Session expired" });
  }
  return res.status(500).json({ error: "An unexpected error occurred" });
}
