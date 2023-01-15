import "../styles/globals.css";
import type { AppProps } from "next/app";
import Navbar from "../components/Navbar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className="min-h-screen bg-page-bg text-white">
        <Navbar />
        <div className="ml-44 mr-10 py-10">
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
}
