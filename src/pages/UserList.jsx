import { useEffect, useState } from "react";
import api from "../config/axios";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = sessionStorage.getItem("token");

    const res = await api.get("/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      setUsers(res.data.data);
    } catch (err) {
      console.error("Users fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading users...</p>;

  return (
    <>
      <div className="pagetitle">
        <h1>Users</h1>
      </div>

      <section className="section">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">User List</h5>

            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Wallet</th>
                  <th>Chain Id</th>
                  <th>Chain Name</th>
                  <th>Balance</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.walletAddress}</td>
                    <td>{user.chainId}</td>
                    <td>{user.chainName}</td>
                    <td>{user.occTokenBalance}</td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        </div>
      </section>
    </>
  );
}
