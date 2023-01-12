import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
    <div className="home-page-container">
      <div className="home-page-content">
        <h1>Admin view</h1>
        <div>
          <h2>Sessions details</h2>
          <p>Client username: {client?.username ?? ""}</p>
          <p>Client ID: {clientId}</p>
          <table>
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Created at</th>
                <th>Consumed at</th>
              </tr>
            </thead>
            <tbody>
              {sessions
                ? sessions?.map((session: any) => (
                    <tr key={session.sessionId}>
                      <td>{session.sessionId}</td>
                      <td>
                        {session?.createdAt
                          ? new Date(session.createdAt).toISOString().split("T")[0]
                          : null}
                      </td>
                      <td>
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
    </div>
  );
}
