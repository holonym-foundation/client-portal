import Image from "next/image";
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import HolonymLogo from "../../img/Holonym-Logo-W.png";
import type { APIKey, ProofSession } from "../../types/types";
import { idServerUrl } from "../../constants/misc";
import SessionsView from "./SessionsView";
import APIKeysView from "./APIKeysView";

export default function ClientHome() {
  const [selectedView, setSelectedView] = useState("sessions");
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [sessions, setSessions] = useState<ProofSession[]>([]);

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

  const sessionsBtnClasses = classNames({
    "cursor-pointer border-b-2 hover:border-holo-blue ease-in-out duration-200": true,
    "border-holo-blue": selectedView === "sessions",
    "border-card-bg": selectedView !== "sessions",
  });

  const apiKeysBtnClasses = classNames({
    "cursor-pointer border-b-2 hover:border-holo-blue ease-in-out duration-200": true,
    "border-holo-blue": selectedView === "api-keys",
    "border-card-bg": selectedView !== "api-keys",
  });

  return (
    <>
      <div className="header fixed w-full min-h-min h-10 top-0 z-0 pl-44 bg-page-bg shadow-sm shadow-holo-blue">
        {/* <h2 className="font-clover-medium text-card-bg">Client Portal</h2> */}
        {/* TODO: Add sign out button that displays on the far right of the screen in this div */}
      </div>
      <div className="fixed min-w-min w-36 h-screen z-10 bg-card-bg p-4 shadow-sm shadow-holo-blue">
        <Image src={HolonymLogo} alt="Holonym Logo" width={200} height={200} />
        <ul className="list-none flex flex-col gap-4 text-lg pt-24">
          <li>
            <button
              className={sessionsBtnClasses}
              data-selected={selectedView === "sessions"}
              onClick={() => setSelectedView("sessions")}
            >
              Sessions
            </button>
          </li>
          <li>
            <button
              className={apiKeysBtnClasses}
              data-selected={selectedView === "api-keys"}
              onClick={() => setSelectedView("api-keys")}
            >
              API Keys
            </button>
          </li>
          {/* TODO: Account page & button */}
          {/* <li className="cursor-pointer border-b-2 border-card-bg hover:border-holo-blue">Account</li> */}
        </ul>
      </div>
      <div className="ml-44 mr-10 py-10">
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
    </>
  );
}
