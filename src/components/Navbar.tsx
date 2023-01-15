import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { idServerUrl } from "../constants/misc";

function Navbar() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (router.pathname.startsWith("/admin") && localStorage.getItem("apiKey")) {
      setIsAdmin(true);
    }
  }, [router.pathname]);

  return (
    <>
      <div style={{ position: "absolute", top: "5" }}>
        {isAdmin ? (
          <Link href="/admin">
            <p className="text-blue-600 hover:underline hover:cursor-pointer">Home</p>
          </Link>
        ) : null}
      </div>
    </>
  );
}

export default Navbar;
