import { useSession } from "next-auth/react";
import AdminNavbar from "./AdminNavbar";
import ClientNavbar from "./ClientNavbar";

function Navbar() {
  const { data: session, status } = useSession();

  return (
    <>
      <div>
        {session?.user?.role === "admin" ? (
          <AdminNavbar />
        ) : session?.user?.role === "client" ? (
          <ClientNavbar />
        ) : null}
      </div>
    </>
  );
}

export default Navbar;
