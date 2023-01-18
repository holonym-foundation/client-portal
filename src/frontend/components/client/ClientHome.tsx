import Image from "next/image";
import React, { useEffect, useState } from "react";
import type { APIKey, ProofSession } from "../../../types/types";
import { thisUrl } from "../../../frontend/constants/misc";
import { useSessionStorage } from "usehooks-ts";
import SessionsView from "./SessionsView";
import APIKeysView from "./APIKeysView";

export default function ClientHome() {
  const [selectedView, setSelectedView] = useSessionStorage(
    "clientSelectedView",
    "sessions"
  );
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [sessions, setSessions] = useState<ProofSession[]>([]);

  useEffect(() => {
    (async () => {
      const resp = await fetch(`${thisUrl}/api/clients/keys`, {
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
      const resp = await fetch(`${thisUrl}/api/clients/sessions`, {
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
    const resp = await fetch(`${thisUrl}/api/clients/keys`, {
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
    const newApiKeys = apiKeys ? [...apiKeys, data.apiKey] : [data.apiKey];
    console.log("newApiKeys", newApiKeys);
    setApiKeys(newApiKeys);
  }

  async function handleClickRevokeAPIKey(event: React.MouseEvent<HTMLButtonElement>) {
    const apiKey = event.currentTarget.getAttribute("data-value");
    const confirmation = window.confirm(
      `Are you sure you want to revoke the following API key?\n${apiKey}`
    );
    if (!confirmation) return;
    const resp = await fetch(`${thisUrl}/api/clients/keys/${apiKey}`, {
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
    <>
      {selectedView === "api-keys" ? (
        <APIKeysView
          apiKeys={apiKeys}
          onClickAddAPIKey={handleClickAddAPIKey}
          onClickRevokeAPIKey={handleClickRevokeAPIKey}
        />
      ) : (
        <SessionsView sessions={sessions} />
      )}
    </>
  );
}
