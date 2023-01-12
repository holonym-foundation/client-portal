import Link from "next/link";
import React, { useEffect, useState } from "react";
import { subMonths } from "date-fns";
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
        <h2>Holonym Client Portal - Admin Login</h2>
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
    <div className="home-page-container">
      {!loggedIn ? (
        <LoginForm onLogin={() => setLoggedIn(true)} />
      ) : (
        <>
          <div className="home-page-content">
            <h1>Admin view</h1>
            <div>
              <h2>Sessions overview</h2>
              <p style={{ marginTop: "10px" }}>
                Total sessions: {sessionsOverview?.total}
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Client ID</th>
                    <th>Total sessions</th>
                    <th>
                      Num sessions (
                      {new Date(subMonths(new Date(), 1)).toLocaleString("default", {
                        month: "short",
                      })}{" "}
                      {new Date(subMonths(new Date(), 1)).toString().split(" ")[3]})
                    </th>
                    <th>
                      Num sessions (
                      {new Date().toLocaleString("default", { month: "short" })}{" "}
                      {new Date().toString().split(" ")[3]})
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {sessionsOverview
                    ? sessionsOverview?.totalByClientId?.map(
                        (sessionMetadata: any) => (
                          <tr key={sessionMetadata.clientId}>
                            <td>{sessionMetadata.username}</td>
                            <td>{sessionMetadata.clientId}</td>
                            <td>{sessionMetadata.total}</td>
                            <td>{sessionMetadata.totalLastMonth}</td>
                            <td>{sessionMetadata.totalThisMonth}</td>
                            <td>
                              <Link
                                href={`/admin/clients/${sessionMetadata.clientId}`}
                              >
                                <p className="link">View details</p>
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
