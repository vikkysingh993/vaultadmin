import { useEffect, useState } from "react";
import api from "../config/axios";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    tokens: 0,
    claimedPlans: 0,
  });

  useEffect(() => {
    api
      .get("/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setStats(res.data.data);
      })
      .catch(() => {
        console.error("Dashboard load failed");
      });
  }, []);


  return (
    <>
      <div className="pagetitle">
        <h1>Dashboard</h1>
        <p>Welcome to Admin Panel</p>
      </div>

      <section className="section dashboard">
        <div className="row">

          {/* USERS */}
          <div className="col-xl-4 col-md-6">
            <div className="card info-card users-card">
              <div className="card-body">
                <h5 className="card-title">Total Users</h5>
                <h6>{stats.users}</h6>
              </div>
            </div>
          </div>

          {/* TOKENS */}
          <div className="col-xl-4 col-md-6">
            <div className="card info-card revenue-card">
              <div className="card-body">
                <h5 className="card-title">Launched Tokens</h5>
                <h6>{stats.tokens}</h6>
              </div>
            </div>
          </div>

          {/* PLANS */}
          <div className="col-xl-4 col-md-6">
            <div className="card info-card customers-card">
              <div className="card-body">
                <h5 className="card-title">Claimed Stake Plans</h5>
                <h6>{stats.claimedPlans}</h6>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
