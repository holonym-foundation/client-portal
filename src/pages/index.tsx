import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSessionStorage } from "usehooks-ts";
import LoginForm from "../frontend/components/client/LoginForm";
import ClientHome from "../frontend/components/client/ClientHome";

export default function Index() {
  const [clientLoggedIn, setClientLoggedIn] = useSessionStorage<boolean>(
    "clientLoggedIn",
    false
  );

  useEffect(() => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    if (username && password) {
      setClientLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    if (!clientLoggedIn) return;
    // Get sessions from server
  }, [clientLoggedIn]);

  return (
    <>
      <Head>
        <title>Holonym Client Portal</title>
        <meta name="description" content="Holonym Client Portal" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      <div>
        {clientLoggedIn ? (
          <ClientHome />
        ) : (
          <LoginForm onLogin={() => setClientLoggedIn(true)} />
        )}
      </div>
    </>
  );
}
