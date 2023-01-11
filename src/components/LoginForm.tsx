import React, { useState } from "react";
import { idServerUrl } from "../constants/misc";

interface FormData {
  username: string;
  password: string;
}

interface LoginFormProps {
  onLogin: (username: string) => void;
}

function LoginForm({ onLogin }: LoginFormProps) {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // console.log("Username: ", formData.username);
    // console.log("Password: ", formData.password);
    const resp = await fetch(`${idServerUrl}/proof-clients/auth`, {
      method: "GET",
      headers: {
        Authorization:
          "Basic " + window.btoa(formData.username + ":" + formData.password),
      },
    });
    const data = await resp.json();
    if (resp.status == 200) {
      localStorage.setItem("username", formData.username);
      localStorage.setItem("password", formData.password);
      onLogin(formData.username);
    }
    console.log(data);
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  return (
    <>
      <div>
        <h2>Holonym Client Portal</h2>
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
        <div className="form-group" style={{ textAlign: "right" }}>
          <button className="btn btn-primary">Submit</button>
        </div>
      </form>
    </>
  );
}

export default LoginForm;
