import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import classNames from "classnames";
import { useSessionStorage } from "usehooks-ts";
import HolonymLogo from "../../img/Holonym-Logo-B.png";

function ClientNavbar() {
  const router = useRouter();
  const [clientSelectedView, setClientSelectedView] = useSessionStorage(
    "clientSelectedView",
    "sessions"
  );

  // const { data: session, status } = useSession();

  const sessionsBtnClasses = classNames({
    "cursor-pointer border-b-2 hover:border-holo-blue ease-in-out duration-200": true,
    "border-holo-blue": clientSelectedView === "sessions",
    "border-card-bg": clientSelectedView !== "sessions",
  });

  const apiKeysBtnClasses = classNames({
    "cursor-pointer border-b-2 hover:border-holo-blue ease-in-out duration-200": true,
    "border-holo-blue": clientSelectedView === "api-keys",
    "border-card-bg": clientSelectedView !== "api-keys",
  });

  const accountBtnClasses = classNames({
    "cursor-pointer border-b-2 hover:border-holo-blue ease-in-out duration-200": true,
    "border-holo-blue": clientSelectedView === "account",
    "border-card-bg": clientSelectedView !== "account",
  });

  return (
    <>
      <div>
        <div className="fixed w-full min-h-min h-10 top-0 z-0 pl-44 flex bg-page-bg shadow-sm shadow-holo-blue">
          <button
            className="ml-auto mr-10 hover:text-blue-600 hover:cursor"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>
        <div className="fixed min-w-min w-36 h-screen z-10 bg-card-bg p-4 shadow-sm shadow-holo-blue">
          <Image src={HolonymLogo} alt="Holonym Logo" width={200} height={200} />
          <ul className="list-none flex flex-col gap-4 text-lg pt-24">
            <li>
              <button
                className={sessionsBtnClasses}
                data-selected={clientSelectedView === "sessions"}
                onClick={() => setClientSelectedView("sessions")}
              >
                Sessions
              </button>
            </li>
            <li>
              <button
                className={apiKeysBtnClasses}
                data-selected={clientSelectedView === "api-keys"}
                onClick={() => setClientSelectedView("api-keys")}
              >
                API Keys
              </button>
            </li>
            <li>
              <button
                className={accountBtnClasses}
                data-selected={clientSelectedView === "account"}
                onClick={() => setClientSelectedView("account")}
              >
                Account
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default ClientNavbar;
