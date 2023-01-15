import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import LoginForm from "../components/LoginForm";
import ClientHome from "../components/client/ClientHome";

export default function Index() {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    if (username && password) {
      setUsername(username);
    }
  }, []);

  useEffect(() => {
    if (!username) return;
    // Get sessions from server
  }, [username]);

  return (
    <>
      <Head>
        <title>Holonym Client Dashboard</title>
        <meta name="description" content="Holonym Client Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <div>{username ? <ClientHome /> : <LoginForm onLogin={setUsername} />}</div>
    </>
  );
}
