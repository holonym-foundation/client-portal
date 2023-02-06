import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import classNames from "classnames";
import { useSessionStorage } from "usehooks-ts";
import HolonymLogo from "../../img/Holonym-Logo-B.png";

function AdminNavbar() {
  const router = useRouter();
  const [adminSelectedView, setAdminSelectedView] = useSessionStorage(
    "adminSelectedView",
    "home"
  );

  useEffect(() => {
    if (router.pathname.endsWith("/admin")) {
      setAdminSelectedView("home");
    } else if (router.pathname.startsWith("/admin/client")) {
      setAdminSelectedView("clientDetails");
    }
  }, [router.pathname, setAdminSelectedView]);

  // const { data: session, status } = useSession();

  const adminHomeBtnClasses = classNames({
    "cursor-pointer border-b-2 hover:border-holo-blue ease-in-out duration-200": true,
    "border-holo-blue": adminSelectedView === "home",
    "border-card-bg": adminSelectedView !== "home",
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
                className={adminHomeBtnClasses}
                onClick={() => setAdminSelectedView("home")}
              >
                <Link href="/admin">Home</Link>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default AdminNavbar;
