import { useSession } from "next-auth/react";
import classNames from "classnames";
import { useSessionStorage } from "usehooks-ts";
import Navbar from "./Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [adminLoggedIn, setAdminLoggedIn] = useSessionStorage<boolean>(
    "adminLoggedIn",
    false
  );
  const { data: session, status } = useSession();

  const mainClasses = classNames({
    "ml-44 mr-10 py-10": session,
    "pt-10": !session,
  });

  return (
    <>
      <div className="min-h-screen bg-page-bg text-black">
        <Navbar />
        <div className={mainClasses}>{children}</div>
      </div>
    </>
  );
}
