// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import mongoose from "mongoose";
import { startOfMonth, subMonths } from "date-fns";
import { authOptions } from "../auth/[...nextauth]";
import { ProofClient, ProofSession } from "../../../backend/models";
import { initializeMongoose } from "../../../backend/database";
import type { ProofSessionDoc } from "../../../types/types";

async function handleGet(req: NextApiRequest, res: NextApiResponse<any>) {
  console.log("GET /admin/sessions: Entered");

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    console.log(`GET admin/sessions/: Admin is not logged in`);
    return res.status(401).json({ error: "Admin is not logged in" });
  }

  if (session?.user?.role !== "admin") {
    console.log(`GET admin/sessions/: User is not an admin`);
    return res.status(401).json({ error: "User is not an admin" });
  }

  // old auth method
  // const apiKey = req.headers["x-api-key"];
  // if (!apiKey) {
  //   console.log("GET /admin/sessions: API key not provided");
  //   return res.status(400).json({ error: "API key not provided" });
  // }
  // if (apiKey != process.env.ADMIN_API_KEY) {
  //   console.log("GET /admin/sessions: API key not valid");
  //   return res.status(401).json({ error: "API key not valid" });
  // }

  await initializeMongoose();

  if (req.query.overview === "true") {
    const firstOfThisMonth = startOfMonth(new Date()).setUTCHours(0, 0, 0, 0);
    const firstOfLastMonth = subMonths(firstOfThisMonth, 1);

    const totalSessions = await ProofSession.countDocuments().exec();
    // "The $group stage has a limit of 100 megabytes of RAM. By default, if the stage
    // exceeds this limit, $group returns an error." - MongoDB docs.
    const totalSessionsByClientId = await ProofSession.aggregate([
      {
        $group: {
          _id: "$clientId",
          total: { $sum: 1 },
          totalThisMonth: {
            $sum: {
              // if createdAt >= 1st of this month, then 1, else 0
              $cond: [
                {
                  $gte: ["$createdAt", firstOfThisMonth],
                },
                1,
                0,
              ],
            },
          },
          totalLastMonth: {
            $sum: {
              // if createdAt >= 1st of last month and createdAt < 1st of this month,
              // then 1, else 0
              $cond: [
                {
                  $and: [
                    {
                      $gte: ["$createdAt", firstOfLastMonth],
                    },
                    {
                      $lt: ["$createdAt", firstOfThisMonth],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $project: {
          clientId: "$_id",
          total: 1,
          totalThisMonth: 1,
          totalLastMonth: 1,
          _id: 0,
        },
      },
    ]);

    const overview = {
      total: totalSessions,
      totalByClientId: totalSessionsByClientId,
    };

    // get client usernames
    const clientIds = totalSessionsByClientId.map((session) => session.clientId);
    const clients = await ProofClient.find({ clientId: { $in: clientIds } });
    overview.totalByClientId.forEach((session) => {
      const client = clients.find((client) => client.clientId === session.clientId);
      session.username = client?.username ?? "";
    });

    return res.status(200).json(overview);
  }

  if (req.query.clientId) {
    const result = await ProofSession.find({ clientId: req.query.clientId });
    const sessions = result.map((session) => session.toObject());
    sessions.sort((a, b) => {
      const aDate = new Date(a.createdAt);
      const bDate = new Date(b.createdAt);
      if (aDate.getFullYear() === bDate.getFullYear()) {
        return aDate.getMonth() - bDate.getMonth();
      }
      return aDate.getFullYear() - bDate.getFullYear();
    });
    sessions.forEach((session: Partial<ProofSessionDoc>) => {
      delete session.consumedBy;
      delete session.clientId;
      delete session._id;
      delete session.__v;
    });
    return res.status(200).json(sessions);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method === "GET") {
    return handleGet(req, res);
  }
}
