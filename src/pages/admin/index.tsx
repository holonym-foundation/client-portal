import Image from "next/image";
import Link from "next/link";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { unstable_getServerSession } from "next-auth/next";
import { subMonths } from "date-fns";
import { authOptions } from "../api/auth/[...nextauth]";
import { thisOrigin } from "../../frontend/constants/misc";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (session?.user?.role !== "admin") {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }
  return {
    props: {
      sessionsOverview: null,
    },
  };
};

export default function AdminHome() {
  const [sessionsOverview, setSessionsOverview] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const resp = await fetch(`${thisOrigin}/api/admin/sessions?overview=true`);
      const data = await resp.json();
      setSessionsOverview(data);
    })();
  }, []);

  return (
    <div>
      <h1 className="font-clover-medium text-3xl py-6">
        Admin View - Sessions Overview
      </h1>
      <div>
        <div className="leading-9">
          <p className="text-lg">Total sessions: {sessionsOverview?.total}</p>
        </div>
        <table className="w-full border-collapse mt-8 border-spacing-0">
          <thead className="bg-card-bg">
            <tr>
              <th className="p-4 text-left border-b-2 border-gray-200">Username</th>
              <th className="p-4 text-left border-b-2 border-gray-200">Client ID</th>
              <th className="p-4 text-left border-b-2 border-gray-200">
                Total sessions
              </th>
              <th className="p-4 text-left border-b-2 border-gray-200">
                Num sessions (
                {new Date(subMonths(new Date(), 1)).toLocaleString("default", {
                  month: "short",
                })}{" "}
                {new Date(subMonths(new Date(), 1)).toString().split(" ")[3]})
              </th>
              <th className="p-4 text-left border-b-2 border-gray-200">
                Num sessions (
                {new Date().toLocaleString("default", { month: "short" })}{" "}
                {new Date().toString().split(" ")[3]})
              </th>
              <th className="p-4 text-left border-b-2 border-gray-200"></th>
            </tr>
          </thead>
          <tbody>
            {sessionsOverview
              ? sessionsOverview?.totalByClientId?.map((sessionMetadata: any) => (
                  <tr key={sessionMetadata.clientId}>
                    <td className="p-4 text-left border-b-2 border-gray-200">
                      {sessionMetadata.username}
                    </td>
                    <td className="p-4 text-left border-b-2 border-gray-200">
                      {sessionMetadata.clientId}
                    </td>
                    <td className="p-4 text-left border-b-2 border-gray-200">
                      {sessionMetadata.total}
                    </td>
                    <td className="p-4 text-left border-b-2 border-gray-200">
                      {sessionMetadata.totalLastMonth}
                    </td>
                    <td className="p-4 text-left border-b-2 border-gray-200">
                      {sessionMetadata.totalThisMonth}
                    </td>
                    <td className="p-4 text-left border-b-2 border-gray-200">
                      <Link href={`/admin/clients/${sessionMetadata.clientId}`}>
                        <p className="text-blue-600 hover:underline hover:cursor-pointer">
                          View details
                        </p>
                      </Link>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
