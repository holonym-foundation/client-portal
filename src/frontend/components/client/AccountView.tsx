import { useState } from "react";
import { useSession } from "next-auth/react";
import classNames from "classnames";
import Modal from "react-modal";

Modal.setAppElement("#modals");

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

function AccountView() {
  const { data: session } = useSession();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  async function handleSubmit() {
    if (formData.newPassword !== formData.confirmNewPassword) {
      // TODO: Make this a toast. Also add real time validation and feedback.
      alert("New passwords do not match");
      return;
    }
    const resp = await fetch("/api/clients/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (resp.status == 200) {
      setChangePasswordSuccess(true);
    }
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  // TODO: Fix hydration error. Very likely on this page.
  // TODO: Test invalid password inputs. Test with invalid current password, invalid new password.
  // TODO: When the change password form is submitted, there is a hydration error and the page reloads. Fix this.

  return (
    <div className="pb-10">
      <h1 className="font-clover-medium text-3xl py-6">Account</h1>

      <div className="text-lg leading-9 max-w-xl">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-1/2 p-4">
            <div className="text-lg font-medium">Username</div>
            <div className="text-lg font-medium">Password</div>
          </div>
          <div className="w-1/2 p-4">
            <div className="text-base font-light">{session?.user?.username}</div>
            <div className="text-base font-light">
              {`*`.repeat(session?.user?.username?.length ?? 0)}
            </div>
          </div>
        </div>
        <button
          className="ml-4 px-4 py-2 text-sm leading-5 duration-150 bg-gray-200 border border-transparent rounded-lg active:bg-gray-400 hover:bg-gray-300 focus:outline-none focus:shadow-outline-gray"
          onClick={() => {
            setChangePasswordSuccess(false);
            setModalIsOpen(true);
          }}
        >
          Change Password
        </button>
      </div>
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
        {changePasswordSuccess ? (
          <div className="m-auto">
            <div className="m-10 flex">
              <h2 className="font-clover-medium text-3xl">
                Password Changed Successfully
              </h2>
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
              <h2 className="font-clover-medium text-3xl">Change Password</h2>
            </div>
            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Current Password</label>
                <input
                  type="password"
                  id="current-password"
                  name="currentPassword"
                  className="form-input"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">New Password</label>
                <input
                  type="password"
                  id="new-password"
                  name="newPassword"
                  className="form-input"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Confirm New Password</label>
                <input
                  type="password"
                  id="new-password"
                  name="confirmNewPassword"
                  className="form-input"
                  value={formData.confirmNewPassword}
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
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default AccountView;
