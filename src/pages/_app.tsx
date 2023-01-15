import "../styles/globals.css";
import type { AppProps } from "next/app";
import classNames from "classnames";
import { useSessionStorage } from "usehooks-ts";
import Navbar from "../components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  const [adminLoggedIn, setAdminLoggedIn] = useSessionStorage<boolean>(
    "adminLoggedIn",
    false
  );
  const [clientLoggedIn, setClientLoggedIn] = useSessionStorage<boolean>(
    "clientLoggedIn",
    false
  );

  const mainClasses = classNames({
    "ml-44 mr-10 py-10": adminLoggedIn || clientLoggedIn,
    // "pt-10 text-center": !adminLoggedIn && !clientLoggedIn,
    "pt-10": !adminLoggedIn && !clientLoggedIn,
  });

  return (
    <>
      <div className="min-h-screen bg-page-bg text-black">
        <Navbar />
        <div className={mainClasses}>
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
}
