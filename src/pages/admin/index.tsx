import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { subMonths } from "date-fns";
import HolonymLogo from "../../img/Holonym-Logo-W.png";
import { idServerUrl } from "../../constants/misc";

interface FormData {
  apiKey: string;
}

interface LoginFormProps {
  onLogin: () => void;
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [formData, setFormData] = useState<FormData>({
    apiKey: "",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const resp = await fetch(`${idServerUrl}/admin/auth`, {
      headers: {
        "X-API-KEY": formData.apiKey,
      },
    });
    const data = await resp.json();
    if (resp.status !== 200) {
      alert(data.data);
      return;
    } else {
      localStorage.setItem("apiKey", formData.apiKey);
      onLogin();
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  return (
    <>
      <div>
        <h2 className="font-clover-medium">Client Portal - Admin Login</h2>
      </div>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="apiKey">API Key</label>
          <input
            type="password"
            id="password"
            name="apiKey"
            className="form-input"
            value={formData.apiKey}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group" style={{ textAlign: "right" }}>
          <button className="btn btn-primary">Submit</button>
        </div>
      </form>
    </>
  );
}

export default function AdminHome() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [sessionsOverview, setSessionsOverview] = useState<any>(null);

  useEffect(() => {
    const apiKey = localStorage.getItem("apiKey");
    if (apiKey) setLoggedIn(true);
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    const apiKey = localStorage.getItem("apiKey");
    if (!apiKey) return;
    (async () => {
      const resp = await fetch(`${idServerUrl}/admin/sessions?overview=true`, {
        headers: {
          "X-API-KEY": apiKey,
        },
      });
      const data = await resp.json();
      console.log(data);
      setSessionsOverview(data);
    })();
  }, [loggedIn]);

  return (
    <div className="text-white">
      {!loggedIn ? (
        <LoginForm onLogin={() => setLoggedIn(true)} />
      ) : (
        <>
          <div className="header fixed w-full min-h-min h-10 top-0 z-0 pl-44 bg-page-bg shadow-sm shadow-holo-blue">
            {/* <h2 className="font-clover-medium text-card-bg">Client Portal</h2> */}
            {/* TODO: Add sign out button that displays on the far right of the screen in this div */}
          </div>
          <div className="fixed min-w-min w-36 h-screen z-10 bg-card-bg p-4 shadow-sm shadow-holo-blue">
            <Image src={HolonymLogo} alt="Holonym Logo" width={200} height={200} />
            {/* <ul className="list-none flex flex-col gap-4 text-lg pt-24">
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
          </ul> */}
          </div>
          <div className="ml-44 mr-10 py-10">
            <h1 className="font-clover-medium text-3xl py-6">Admin view</h1>
            <div>
              <div className="leading-9">
                <h2 className="font-clover-medium text-2xl">Sessions overview</h2>
                <p className="text-lg">Total sessions: {sessionsOverview?.total}</p>
              </div>
              <table className="w-full border-collapse mt-8 border-spacing-0">
                <thead className="bg-card-bg">
                  <tr>
                    <th className="p-4 text-left border-b-2 border-gray-900">
                      Username
                    </th>
                    <th className="p-4 text-left border-b-2 border-gray-900">
                      Client ID
                    </th>
                    <th className="p-4 text-left border-b-2 border-gray-900">
                      Total sessions
                    </th>
                    <th className="p-4 text-left border-b-2 border-gray-900">
                      Num sessions (
                      {new Date(subMonths(new Date(), 1)).toLocaleString("default", {
                        month: "short",
                      })}{" "}
                      {new Date(subMonths(new Date(), 1)).toString().split(" ")[3]})
                    </th>
                    <th className="p-4 text-left border-b-2 border-gray-900">
                      Num sessions (
                      {new Date().toLocaleString("default", { month: "short" })}{" "}
                      {new Date().toString().split(" ")[3]})
                    </th>
                    <th className="p-4 text-left border-b-2 border-gray-900"></th>
                  </tr>
                </thead>
                <tbody>
                  {sessionsOverview
                    ? sessionsOverview?.totalByClientId?.map(
                        (sessionMetadata: any) => (
                          <tr key={sessionMetadata.clientId}>
                            <td className="p-4 text-left border-b-2 border-gray-900">
                              {sessionMetadata.username}
                            </td>
                            <td className="p-4 text-left border-b-2 border-gray-900">
                              {sessionMetadata.clientId}
                            </td>
                            <td className="p-4 text-left border-b-2 border-gray-900">
                              {sessionMetadata.total}
                            </td>
                            <td className="p-4 text-left border-b-2 border-gray-900">
                              {sessionMetadata.totalLastMonth}
                            </td>
                            <td className="p-4 text-left border-b-2 border-gray-900">
                              {sessionMetadata.totalThisMonth}
                            </td>
                            <td className="p-4 text-left border-b-2 border-gray-900">
                              <Link
                                href={`/admin/clients/${sessionMetadata.clientId}`}
                              >
                                <p className="text-blue-600 hover:underline hover:cursor-pointer">
                                  View details
                                </p>
                              </Link>
                            </td>
                          </tr>
                        )
                      )
                    : null}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
