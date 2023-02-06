import Head from "next/head";
import Image from "next/image";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";
import { initializeMongoose } from "../backend/database";
import { ProofSession, ProofClient } from "../backend/models";
import LoginForm from "../frontend/components/client/LoginForm";
import ClientHome from "../frontend/components/client/ClientHome";
import { APIKey } from "../types/types";

interface Props {
  // TODO: Update this
  session: any;
  proofSessions: any;
  apiKeys: any;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  if (session?.user?.role === "admin") {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }

  await initializeMongoose();

  const proofSessions =
    (await ProofSession.find({ clientId: session?.user?.id }).exec())?.map(
      (session) => ({
        sessionId: session.sessionId,
        clientId: session.clientId,
        createdAt: session.createdAt,
        consumedAt: session?.consumedAt ?? null,
        consumedBy: session?.consumedBy ?? null,
      })
    ) ?? [];
  const client = await ProofClient.findOne({ clientId: session?.user?.id }).exec();

  const apiKeys = client?.apiKeys.map((key: APIKey) => ({
    key: key.key,
    active: key.active,
  }));

  return {
    props: {
      session,
      proofSessions: proofSessions,
      apiKeys: apiKeys,
    },
  };
};

export default function Index({ session, proofSessions, apiKeys }: Props) {
  return (
    <>
      <Head>
        <title>Holonym Client Portal</title>
        <meta name="description" content="Holonym Client Portal" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <div>
        <ClientHome sessions={proofSessions} apiKeys={apiKeys} />
      </div>
    </>
  );
}
