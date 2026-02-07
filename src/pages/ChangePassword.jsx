import { useState } from "react";
import api from "../config/axios";
import Swal from "sweetalert2";
export default function ChangePassword() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const token = sessionStorage.getItem("token");

  const submit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
        return Swal.fire({
            icon: "error",
            title: "Password Error",
            text: "Passwords do not match",
        }); 
    //   return alert("Passwords do not match");
    }

    await api.post(
      "/auth/change-password",
      {
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    Swal.fire({
            icon: "success",
            title: "Password Changed",
            text: "Your password has been changed successfully",
            confirmButtonColor: "#198754",
        });
    setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <>
      <h2>Change Password</h2>

      <form onSubmit={submit} style={{ maxWidth: "400px" }}>
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Old Password"
          value={form.oldPassword}
          onChange={(e) =>
            setForm({ ...form, oldPassword: e.target.value })
          }
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="New Password"
          value={form.newPassword}
          onChange={(e) =>
            setForm({ ...form, newPassword: e.target.value })
          }
        />

        <input
          type="password"
          className="form-control mb-3"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />

        <button className="btn btn-primary">Change Password</button>
      </form>
    </>
  );
}
