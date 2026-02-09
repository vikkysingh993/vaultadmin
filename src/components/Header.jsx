import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../config/axios";

// ✅ ENV BASE URL
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  

export default function Header() {
  const navigate = useNavigate();
  const hasLoaded = useRef(false);

  const [profileImg, setProfileImg] = useState(
    "/assets/img/profile-img.jpg"
  );
  const [adminName, setAdminName] = useState("Admin");

  const token = sessionStorage.getItem("token");

  /* ======================
     LOAD PROFILE IMAGE
  ====================== */
  useEffect(() => {
    if (!token || hasLoaded.current) return;
    hasLoaded.current = true;

    const loadProfile = async () => {
      try {
        const res = await api.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = res.data.data;
        setAdminName(user.name);

        if (user?.profileImage) {
          if (user.profileImage.startsWith("http")) {
            setProfileImg(user.profileImage);
          } else {
            setProfileImg(`${API_BASE_URL}${user.profileImage}`);
          }
        }
      } catch (err) {
        console.error("Header profile load failed");
      }
    };

    loadProfile();
  }, [token]);

  /* ======================
     LOGOUT
  ====================== */
  const logout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <header
      id="header"
      className="header fixed-top d-flex align-items-center"
    >
      {/* LOGO */}
      <div className="d-flex align-items-center justify-content-between">
        <Link to="/" className="logo d-flex align-items-center">
          <img src="/assets/img/logo.png" alt="Logo" />
          <span className="d-none d-lg-block"></span>
        </Link>
      </div>

      {/* RIGHT NAV */}
      <nav className="header-nav ms-auto">
        <ul className="d-flex align-items-center">
          {/* PROFILE DROPDOWN */}
          <li className="nav-item dropdown pe-3">
            <a
              className="nav-link nav-profile d-flex align-items-center pe-0"
              href="#"
              data-bs-toggle="dropdown"
            >
              <img
                src={profileImg}
                alt="Profile"
                className="rounded-circle"
                onError={(e) => {
                  e.target.src = "/assets/img/profile-img.jpg";
                }}
              />
              <span className="d-none d-md-block dropdown-toggle ps-2">
                {adminName}
              </span>
            </a>

            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
              <li className="dropdown-header">
                <h6>{adminName}</h6>
                <span>Administrator</span>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <Link
                  className="dropdown-item d-flex align-items-center"
                  to="/profile"
                >
                  <i className="bi bi-person"></i>
                  <span>My Profile</span>
                </Link>
              </li>

              <li>
                <Link
                  className="dropdown-item d-flex align-items-center"
                  to="/change-password"
                >
                  <i className="bi bi-lock"></i>
                  <span>Change Password</span>
                </Link>
              </li>

              <li>
                <Link
                  className="dropdown-item d-flex align-items-center"
                  to="/settings"
                >
                  <i className="bi bi-gear"></i>
                  <span>Settings</span>
                </Link>
              </li>

              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <button
                  className="dropdown-item d-flex align-items-center"
                  onClick={logout}
                  style={{ background: "none", border: "none" }}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
}
