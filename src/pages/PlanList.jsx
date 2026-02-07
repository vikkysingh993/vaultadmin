import { useEffect, useState } from "react";
import api from "../config/axios";
import { authHeader } from "../utils/authHeader";

export default function PlanList() {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    months: "",
    price: "",
    apy: "",
    status: "ACTIVE",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const token = sessionStorage.getItem("token");
        const res = await api.get("/plans", { headers: authHeader() });
    setPlans(res.data.data);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (editingId) {
      await api.put(
        `/plans/${editingId}`,
        form,
        { headers: authHeader() }
      );
    } else {
      await api.post(
        "/plans/add-plan",
        form,
        { headers: authHeader() }
      );
    }

    setForm({ months: "", price: "", apy: "", status: "ACTIVE" });
    setEditingId(null);
    fetchPlans();
  } catch (err) {
    console.error("Save plan error", err);
  }
};

  const handleEdit = async (id) => {
  try {
    const res = await api.get(
      `/plans/${id}`,
      { headers: authHeader() }
    );

    setForm({
      months: res.data.data.months,
      price: res.data.data.price,
      apy: res.data.data.apy,
      status: res.data.data.status,
    });

    setEditingId(id);
  } catch (err) {
    console.error("Fetch plan error", err);
  }
};


  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;

    try {
        await api.delete(
        `/plans/${id}`,
        { headers: authHeader() }
        );
        fetchPlans();
    } catch (err) {
        console.error("Delete plan error", err);
    }
    };


  return (
    <>
      <div className="pagetitle">
        <h1>Stake Plans</h1>
      </div>

      {/* ADD / EDIT FORM */}
      <section className="section">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">
              {editingId ? "Edit Plan" : "Add Plan"}
            </h5>

            <form onSubmit={handleSubmit} className="row g-3">
              <div className="col-md-3">
                <input
                  type="number"
                  placeholder="Months"
                  className="form-control"
                  value={form.months}
                  onChange={(e) =>
                    setForm({ ...form, months: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-md-3">
                <input
                  type="number"
                  placeholder="Price"
                  className="form-control"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  required
                />
              </div>

              <div className="col-md-3">
                <input
                  type="text"
                  placeholder="APY"
                  className="form-control"
                  value={form.apy}
                  onChange={(e) =>
                    setForm({ ...form, apy: e.target.value })
                  }
                />
              </div>

              <div className="col-md-2">
                <select
                  className="form-control"
                  value={form.status}
                  onChange={(e) =>
                    setForm({ ...form, status: e.target.value })
                  }
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>

              <div className="col-md-1">
                <button className="btn btn-primary w-100">
                  {editingId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* LIST */}
      <section className="section">
        <div className="card">
          <div className="card-body">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Months</th>
                  <th>Price</th>
                  <th>APy</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((p, i) => (
                  <tr key={p.id}>
                    <td>{i + 1}</td>
                    <td>{p.months}</td>
                    <td>{p.price}</td>
                    <td>{p.apy}</td>
                    <td>
                      <span
                        className={
                          p.status === "ACTIVE"
                            ? "badge bg-success"
                            : "badge bg-secondary"
                        }
                      >
                        {p.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEdit(p)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(p.id)}
                      >
                        Delete
                      </button>
                    </td>
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
