import { useEffect, useRef, useState } from "react";
import api from "../config/axios";
import Swal from "sweetalert2";

// ✅ VITE env variable (FIXED)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export default function AdminProfile() {
  const token = sessionStorage.getItem("token");

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("/assets/img/default-avatar.png");
  const [loading, setLoading] = useState(true);

  /* ======================
     LOAD PROFILE
  ====================== */
const hasLoaded = useRef(false);

useEffect(() => {
  if (hasLoaded.current) return; // 🔒 STOP duplicate call
  hasLoaded.current = true;

  const loadProfile = async () => {
    try {
      const res = await api.get("/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = res.data.data;

      setForm({
        name: user.name || "",
        email: user.email || "",
      });

      if (user.profileImage) {
        setPreview(
          user.profileImage.startsWith("http")
            ? user.profileImage
            : `${API_BASE_URL}${user.profileImage}`
        );
      }
    } catch (err) {
      Swal.fire("Error", "Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  loadProfile();
}, []);

  /* ======================
     SUBMIT
  ====================== */
  const submit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", form.name);
    if (image) data.append("profileImage", image);

    try {
      await api.put("/auth/profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: "Your profile has been updated successfully",
        confirmButtonColor: "#198754",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong",
      });
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <>
      <h2>Admin Profile</h2>

      <form onSubmit={submit} style={{ maxWidth: 420 }}>
        {/* 🖼️ IMAGE PREVIEW */}
        <div style={{ marginBottom: 15 }}>
          <img
            src={preview}
            alt="profile"
            onError={(e) => {
              e.target.src = "/assets/img/default-avatar.png";
            }}
            style={{
              width: 110,
              height: 110,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1px solid #ddd",
            }}
          />
        </div>

        {/* IMAGE UPLOAD */}
        <input
          type="file"
          className="form-control mb-3"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (!file) return;

            setImage(file);
            setPreview(URL.createObjectURL(file)); // instant preview
          }}
        />

        {/* NAME */}
        <input
          className="form-control mb-3"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        {/* EMAIL (READONLY) */}
        <input
          className="form-control mb-3"
          placeholder="Email"
          value={form.email}
          readOnly
          style={{
            backgroundColor: "#f5f5f5",
            cursor: "not-allowed",
          }}
        />

        <button className="btn btn-success w-100">
          Update Profile
        </button>
      </form>
    </>
  );
}
