import Image from "next/image";
import Link from "next/link";
import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import { unstable_getServerSession } from "next-auth/next";
import Modal from "react-modal";
import { subMonths } from "date-fns";
import { authOptions } from "../api/auth/[...nextauth]";
import { thisOrigin } from "../../frontend/constants/misc";

interface FormData {
  username: string;
}

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

export default function ManageClients() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [addClientSuccess, setAddClientSuccess] = useState(false);
  const [newClient, setNewClient] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({
    username: "",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const resp = await fetch("/api/admin/clients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (resp.status == 201) {
      setAddClientSuccess(true);
      setNewClient(await resp.json());
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  // TODO: Finish this component. Display other things that fall into the category of "managing clients."
  // Start with a table of all clients.

  return (
    <div>
      <h1 className="font-clover-medium text-3xl py-6">Admin View - Manage Clients</h1>
      <div>
        <button
          className="px-4 py-2 text-sm leading-5 duration-150 bg-gray-200 border border-transparent rounded-lg active:bg-gray-400 hover:bg-gray-300 focus:outline-none focus:shadow-outline-gray"
          onClick={() => {
            setAddClientSuccess(false);
            setModalIsOpen(true);
          }}
        >
          Create Client Account
        </button>
        <Modal
          isOpen={modalIsOpen}
          // onAfterOpen={afterOpenModal}
          onRequestClose={() => setModalIsOpen(false)}
          style={{
            content: {
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
          }}
          contentLabel="Example Modal"
        >
          {addClientSuccess ? (
            <div className="m-auto">
              <div className="m-4 flex">
                <h2 className="font-clover-medium text-3xl">
                  Successfully created new client account
                </h2>
              </div>
              <div className="flex flex-wrap justify-between items-center">
                <div className="w-1/2 p-4">
                  <div className="text-lg font-medium py-3">Username</div>
                  <div className="text-lg font-medium py-3">Password</div>
                  <div className="text-lg font-medium py-3">Client ID</div>
                </div>
                <div className="w-1/2 p-4">
                  <div className="text-base font-light py-3">
                    {newClient?.username}
                  </div>
                  <div className="text-base font-light py-3">
                    {newClient?.password}
                  </div>
                  <div className="text-base font-light py-3">
                    {newClient?.clientId}
                  </div>
                </div>
              </div>
              <div className="ml-4 mb-4">
                <p>
                  You can copy the username and password and send them to the new
                  client.
                </p>
              </div>
              <div className="form-group flex justify-between w-full">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => setModalIsOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="m-auto">
              <div className="mt-4 flex">
                <h2 className="font-clover-medium text-3xl">Add Client</h2>
              </div>
              <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="username">Client Username</label>
                  <input
                    type="text"
                    id="new-client-username"
                    name="username"
                    className="form-input"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group flex justify-between w-full">
                  <button
                    className="btn btn-secondary"
                    type="button"
                    onClick={() => setModalIsOpen(false)}
                  >
                    Cancel
                  </button>
                  <button className="btn btn-primary" type="submit">
                    Create Client
                  </button>
                </div>
              </form>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
