import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { useSessionStorage } from "usehooks-ts";
import { authOptions } from "../../../api/auth/[...nextauth]";
import HolonymLogo from "../../../../img/Holonym-Logo-B.png";
import { thisOrigin } from "../../../../frontend/constants/misc";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (session?.user?.role !== "admin") {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  return {
    props: {
      sessionsOverview: null,
    },
  };
};

export default function ClientSessions() {
  const router = useRouter();
  const { clientId } = router.query;
  const [sessions, setSessions] = useState<any>(null);
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const resp = await fetch(
        `${thisOrigin}/api/admin/sessions?clientId=${clientId}`
      );
      const data = await resp.json();
      setSessions(data);
    })();
    (async () => {
      const resp = await fetch(`${thisOrigin}/api/admin/clients/${clientId}`);
      const data = await resp.json();
      setClient(data);
    })();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-clover-medium py-6">
        Admin View - Sessions Details
      </h1>
      <div className="text-lg leading-9">
        <p>Client username: {client?.username ?? ""}</p>
        <p>Client ID: {clientId}</p>
      </div>
      <table className="w-full border-collapse mt-8 border-spacing-0">
        <thead className="bg-card-bg">
          <tr>
            <th className="p-4 text-left border-b-2 border-gray-200">Session ID</th>
            <th className="p-4 text-left border-b-2 border-gray-200">Created at</th>
            <th className="p-4 text-left border-b-2 border-gray-200">Consumed at</th>
          </tr>
        </thead>
        <tbody>
          {sessions
            ? sessions?.map((session: any) => (
                <tr key={session.sessionId}>
                  <td className="p-4 text-left border-b-2 border-gray-200">
                    {session.sessionId}
                  </td>
                  <td className="p-4 text-left border-b-2 border-gray-200">
                    {session?.createdAt
                      ? new Date(session.createdAt).toISOString().split("T")[0]
                      : null}
                  </td>
                  <td className="p-4 text-left border-b-2 border-gray-200">
                    {session?.consumedAt
                      ? new Date(session.consumedAt).toISOString().split("T")[0]
                      : null}
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </>
  );
}
