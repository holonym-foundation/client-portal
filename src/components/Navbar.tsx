import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import classNames from "classnames";
import HolonymLogo from "../img/Holonym-Logo-W.png";
import { useSessionStorage } from "usehooks-ts";

// TODO: Separate this component into an admin navbar component and a client navbar component

function Navbar() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useSessionStorage<boolean>("isAdmin", false);
  const [adminSelectedView, setAdminSelectedView] = useSessionStorage(
    "adminSelectedView",
    "home"
  );
  const [clientSelectedView, setClientSelectedView] = useSessionStorage(
    "clientSelectedView",
    "sessions"
  );

  useEffect(() => {
    if (router.pathname.startsWith("/admin") && localStorage.getItem("apiKey")) {
      setIsAdmin(true);
    } else if (!router.pathname.startsWith("/admin")) {
      setIsAdmin(false);
    }
    if (router.pathname.endsWith("/admin") && localStorage.getItem("apiKey")) {
      setAdminSelectedView("home");
    } else if (
      router.pathname.startsWith("/admin/client") &&
      localStorage.getItem("apiKey")
    ) {
      setAdminSelectedView("clientDetails");
    }
  }, [router.pathname]);

  const adminHomeBtnClasses = classNames({
    "cursor-pointer border-b-2 hover:border-holo-blue ease-in-out duration-200": true,
    "border-holo-blue": adminSelectedView === "home",
    "border-card-bg": adminSelectedView !== "home",
  });

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

  return (
    <>
      <div style={{ position: "absolute", top: "5" }}>
        {isAdmin ? (
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
                    className={adminHomeBtnClasses}
                    onClick={() => setAdminSelectedView("home")}
                  >
                    <Link href="/admin">Home</Link>
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
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
                {/* TODO: Account page & button */}
                {/* <li className="cursor-pointer border-b-2 border-card-bg hover:border-holo-blue">Account</li> */}
              </ul>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Navbar;
