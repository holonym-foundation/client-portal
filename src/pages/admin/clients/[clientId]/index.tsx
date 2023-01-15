import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSessionStorage } from "usehooks-ts";
import HolonymLogo from "../../../../img/Holonym-Logo-W.png";
import { idServerUrl } from "../../../../constants/misc";

export default function ClientSessions() {
  const router = useRouter();
  const { clientId } = router.query;
  const [adminLoggedIn, setAdminLoggedIn] = useSessionStorage<boolean>(
    "adminLoggedIn",
    false
  );
  const [sessions, setSessions] = useState<any>(null);
  const [client, setClient] = useState<any>(null);

  useEffect(() => {
    const apiKey = localStorage.getItem("apiKey");
    if (!apiKey) return;
    (async () => {
      const resp = await fetch(`${idServerUrl}/admin/sessions?clientId=${clientId}`, {
        headers: {
          "X-API-KEY": apiKey,
        },
      });
      const data = await resp.json();
      console.log(data);
      setSessions(data);
    })();
    (async () => {
      const resp = await fetch(`${idServerUrl}/admin/clients/${clientId}`, {
        headers: {
          "X-API-KEY": apiKey,
        },
      });
      const data = await resp.json();
      console.log(data);
      setClient(data);
    })();
  }, []);

  return (
    <>
      {adminLoggedIn ? (
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
                <th className="p-4 text-left border-b-2 border-gray-900">
                  Session ID
                </th>
                <th className="p-4 text-left border-b-2 border-gray-900">
                  Created at
                </th>
                <th className="p-4 text-left border-b-2 border-gray-900">
                  Consumed at
                </th>
              </tr>
            </thead>
            <tbody>
              {sessions
                ? sessions?.map((session: any) => (
                    <tr key={session.sessionId}>
                      <td className="p-4 text-left border-b-2 border-gray-900">
                        {session.sessionId}
                      </td>
                      <td className="p-4 text-left border-b-2 border-gray-900">
                        {session?.createdAt
                          ? new Date(session.createdAt).toISOString().split("T")[0]
                          : null}
                      </td>
                      <td className="p-4 text-left border-b-2 border-gray-900">
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
      ) : null}
    </>
  );
}
