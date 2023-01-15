import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import HolonymLogo from "../../../../img/Holonym-Logo-W.png";
import { idServerUrl } from "../../../../constants/misc";

export default function ClientSessions() {
  const router = useRouter();
  const { clientId } = router.query;
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
    <div className="">
      <div className="header fixed w-full min-h-min h-10 top-0 z-0 pl-44 bg-page-bg shadow-sm shadow-holo-blue">
        {/* <h2 className="font-clover-medium text-card-bg">Client Portal</h2> */}
        {/* TODO: Add sign out button that displays on the far right of the screen in this div */}
      </div>
      <div className="fixed min-w-min w-36 h-screen z-10 bg-card-bg p-4 shadow-sm shadow-holo-blue">
        <Image src={HolonymLogo} alt="Holonym Logo" width={200} height={200} />
        <ul className="list-none flex flex-col gap-4 text-lg pt-24">
          <li>
            <Link href="/admin">Home</Link>
          </li>
          {/* TODO: Account page & button */}
          {/* <li className="cursor-pointer border-b-2 border-card-bg hover:border-holo-blue">Account</li> */}
        </ul>
      </div>

      <div className="content ml-44 mr-10 pt-10">
        <h1 className="text-3xl font-clover-medium py-6">Sessions details</h1>
        <div className="text-lg leading-9">
          <p>Client username: {client?.username ?? ""}</p>
          <p>Client ID: {clientId}</p>
        </div>
        <table className="w-full border-collapse mt-8 border-spacing-0">
          <thead className="bg-card-bg">
            <tr>
              <th className="p-4 text-left border-b-2 border-gray-900">Session ID</th>
              <th className="p-4 text-left border-b-2 border-gray-900">Created at</th>
              <th className="p-4 text-left border-b-2 border-gray-900">Consumed at</th>
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
      </div>
    </div>
  );
}
