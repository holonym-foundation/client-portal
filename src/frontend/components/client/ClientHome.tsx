import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import type { APIKey, ProofSession } from "../../../types/types";
import { thisOrigin } from "../../../frontend/constants/misc";
import { useSessionStorage } from "usehooks-ts";
import SessionsView from "./SessionsView";
import APIKeysView from "./APIKeysView";
import AccountView from "./AccountView";

interface Props {
  apiKeys: APIKey[];
  sessions: ProofSession[];
}

export default function ClientHome(props: Props) {
  const [selectedView, setSelectedView] = useSessionStorage(
    "clientSelectedView",
    "sessions"
  );
  const [apiKeys, setApiKeys] = useState(props.apiKeys);
  const { data: session, status } = useSession();

  async function handleClickAddAPIKey() {
    const resp = await fetch(`${thisOrigin}/api/clients/keys`, {
      method: "POST",
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
    const resp = await fetch(`${thisOrigin}/api/clients/keys/${apiKey}`, {
      method: "DELETE",
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
      ) : selectedView === "sessions" ? (
        <SessionsView sessions={props.sessions} />
      ) : (
        <AccountView />
      )}
    </>
  );
}
