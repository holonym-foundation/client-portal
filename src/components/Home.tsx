import React, { useEffect, useState } from "react";
import { idServerUrl } from "../constants/misc";

export default function Home() {
  const [selectedView, setSelectedView] = useState("api-keys");
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    (async () => {
      const resp = await fetch(`${idServerUrl}/proof-clients/api-keys`, {
        method: "GET",
        headers: {
          Authorization:
            "Basic " +
            window.btoa(
              localStorage.getItem("username") + ":" + localStorage.getItem("password")
            ),
        },
      });
      const data = await resp.json();
      setApiKeys(data.apiKeys);
    })();
    (async () => {
      const resp = await fetch(`${idServerUrl}/proof-clients/sessions`, {
        method: "GET",
        headers: {
          Authorization:
            "Basic " +
            window.btoa(
              localStorage.getItem("username") + ":" + localStorage.getItem("password")
            ),
        },
      });
      const data = await resp.json();
      setSessions(data.sessions);
      console.log(data);
    })();
  }, []);

  async function handleClickAddAPIKey() {
    const resp = await fetch(`${idServerUrl}/proof-clients/api-keys`, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          window.btoa(
            localStorage.getItem("username") + ":" + localStorage.getItem("password")
          ),
      },
    });
    const data = await resp.json();
    const newApiKeys = [...apiKeys, data.apiKey];
    console.log("newApiKeys", newApiKeys);
    setApiKeys(newApiKeys);
  }

  async function handleClickRevokeAPIKey(event: React.MouseEvent<HTMLButtonElement>) {
    const apiKey = event.currentTarget.getAttribute("data-value");
    const confirmation = window.confirm(
      `Are you sure you want to revoke the following API key?\n${apiKey}`
    );
    if (!confirmation) return;
    const resp = await fetch(`${idServerUrl}/proof-clients/api-keys/${apiKey}`, {
      method: "DELETE",
      headers: {
        Authorization:
          "Basic " +
          window.btoa(
            localStorage.getItem("username") + ":" + localStorage.getItem("password")
          ),
      },
    });
    const data = await resp.json();
    const revokedApiKey = data.apiKey;
    const newApiKeys = apiKeys.map((apiKey) => {
      if (apiKey.key === revokedApiKey.key) {
        apiKey.active = false;
      }
      return apiKey;
    });
    setApiKeys(newApiKeys);
  }

  return (
    <div className="home-page-container">
      <div className="menu-container">
        <button
          data-selected={selectedView === "api-keys"}
          onClick={() => setSelectedView("api-keys")}
        >
          API Keys
        </button>
        <button
          data-selected={selectedView === "sessions"}
          onClick={() => setSelectedView("sessions")}
        >
          Sessions
        </button>
      </div>
      <div className="view-container">
        {selectedView === "api-keys" ? (
          <APIKeysView
            apiKeys={apiKeys}
            onClickAddAPIKey={handleClickAddAPIKey}
            onClickRevokeAPIKey={handleClickRevokeAPIKey}
          />
        ) : (
          <SessionsView sessions={sessions} />
        )}
      </div>
    </div>
  );
}
interface APIKey {
  key: string;
  active: boolean;
}

interface Session {
  sessionId: string;
  createdAt: number | undefined;
  consumedAt: number | undefined;
}

interface APIKeysViewProps {
  apiKeys: APIKey[];
  onClickAddAPIKey: () => void;
  onClickRevokeAPIKey: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface SessionsViewProps {
  sessions: Session[];
}

function APIKeysView({
  apiKeys,
  onClickAddAPIKey,
  onClickRevokeAPIKey,
}: APIKeysViewProps) {
  return (
    <div className="api-keys-view">
      <h1>API Keys</h1>
      <table>
        <thead>
          <tr>
            <th>API Key</th>
            <th>Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {apiKeys
            ? apiKeys.map((apiKey) => (
                <tr key={apiKey.key}>
                  <td
                    style={{
                      textDecoration: apiKey.active ? "none" : "line-through",
                      color: apiKey.active ? "#000" : "#555",
                    }}
                  >
                    {apiKey.key}
                  </td>
                  <td
                    style={{
                      color: apiKey.active ? "#151" : "#511",
                    }}
                  >
                    {apiKey.active ? "Yes" : "No"}
                  </td>
                  <td>
                    <button
                      data-value={apiKey.key}
                      className="btn btn-large-quiet"
                      onClick={onClickRevokeAPIKey}
                    >
                      Revoke key
                    </button>
                  </td>
                </tr>
              ))
            : null}
          <tr>
            <td colSpan={3} style={{ textAlign: "center" }}>
              <button className="btn btn-large-quiet" onClick={onClickAddAPIKey}>
                Add key
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function SessionsView({ sessions }: SessionsViewProps) {
  function copyCode() {
    const code = `const config = {
      headers: {
        "X-API-KEY": "YOUR_API_KEY",
      },
    }
    const url = "https://id-server.holonym.io/sessions/";
    const resp = await axios.post(url, {}, config);
    const { sessionId } = resp.data;`;
    navigator.clipboard
      .writeText(code ?? "")
      .then(() => {
        console.log("Code copied to clipboard");
      })
      .catch((err) => {
        console.log("Error occured while copying: ", err);
      });
  }

  return (
    <div className="sessions-view">
      <h1>Sessions</h1>
      <div>
        <div>
          <p>Total Sessions: {sessions?.length ?? 0}</p>
          <p>
            Total Sessions Consumed:{" "}
            {sessions?.filter((session) => session.consumedAt).length ?? 0}
          </p>
        </div>
        <div
          style={{
            minWidth: "fit-content",
            width: "100%",
            boxSizing: "border-box",
            height: "100%",
          }}
        >
          <div className="code-block">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div className="code-header">
                <h2 className="code-header-title">Create a session</h2>
              </div>
              <button
                className="copy-btn"
                onClick={copyCode}
                aria-label="Copy code to clipboard"
                title="Copy code to clipboard"
              >
                Copy code
              </button>
            </div>
            <pre id="code-to-copy">
              <code className="language-javascript">
                {`1. const config = {
2.   headers: {
3.     "X-API-KEY": "YOUR_API_KEY",
4.   },
5. }`}
              </code>
              <br />
              <code className="language-javascript">
                {`6. const url = "https://id-server.holonym.io/sessions/";`}
              </code>
              <br />
              <code className="language-javascript">
                {`7. const resp = await axios.post(url, {}, config);`}
              </code>
              <br />
              <code className="language-javascript">
                {`8. const { sessionId } = resp.data;`}
              </code>
            </pre>
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Session ID</th>
            <th>Created At</th>
            <th>Consumed At</th>
          </tr>
        </thead>
        <tbody>
          {sessions
            ? sessions.map((session) => (
                <tr key={session.sessionId}>
                  <td>{session.sessionId}</td>
                  <td>
                    {typeof session.createdAt == "number"
                      ? new Date(session.createdAt).toISOString()
                      : null}
                  </td>
                  <td>
                    {typeof session.consumedAt == "number"
                      ? new Date(session.consumedAt).toISOString()
                      : null}
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </div>
  );
}
