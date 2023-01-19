import React, { useState } from "react";
import Image from "next/image";
import HolonymLogo from "../../img/Holonym-Logo-B.png";
import { thisUrl } from "../../../frontend/constants/misc";

interface FormData {
  username: string;
  password: string;
}

interface LoginFormProps {
  onLogin: () => void;
}

// TODO: Rewrite this component to be the UI for the next-auth signin page

function LoginForm({ onLogin }: LoginFormProps) {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    // old
    // event.preventDefault();
    // const resp = await fetch(`${thisUrl}/api/clients/auth`, {
    //   method: "GET",
    //   headers: {
    //     Authorization:
    //       "Basic " + window.btoa(formData.username + ":" + formData.password),
    //   },
    // });
    // const data = await resp.json();
    // if (resp.status == 200) {
    //   localStorage.setItem("username", formData.username);
    //   localStorage.setItem("password", formData.password);
    //   onLogin();
    // }
    // console.log(data);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  return (
    <div className="flex">
      <div className="fixed absolute top-0 p-4">
        <Image src={HolonymLogo} alt="Holonym Logo" width={200} height={200} />
      </div>
      <div className="m-auto">
        <div className="mt-10 flex">
          <h2 className="font-clover-medium text-3xl">Client Portal</h2>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group text-right">
            <button className="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
