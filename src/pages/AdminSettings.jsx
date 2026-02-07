import { useEffect, useState } from "react";
import api from "../config/axios";
import Swal from "sweetalert2";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    tokenFee: "",
    processingFee: "",
    receiveWallet: "",
  });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await api.get("/admin/settings", {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        setForm({
          tokenFee: res.data.data.tokenFee || "",
          processingFee: res.data.data.processingFee || "",
          receiveWallet: res.data.data.receiveWallet || "",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.put("/admin/settings", form, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      });
      Swal.fire("Success", "Settings updated", "success");
    } catch (err) {
      Swal.fire("Error", "Failed to update settings", "error");
    }
  };

  /* ✅ SINGLE RETURN — THIS IS IMPORTANT */
  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        <h4>Loading settings...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <div className="pagetitle">
        <h1>Settings</h1>
        <p>Platform configuration</p>
      </div>

      <div className="card">
        <div className="card-body pt-3">
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="form-label">Token Fee</label>
              <input
                type="number"
                className="form-control"
                value={form.tokenFee}
                onChange={(e) =>
                  setForm({ ...form, tokenFee: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Processing Fee</label>
              <input
                type="number"
                className="form-control"
                value={form.processingFee}
                onChange={(e) =>
                  setForm({ ...form, processingFee: e.target.value })
                }
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Receive Wallet Address</label>
              <input
                type="text"
                className="form-control"
                value={form.receiveWallet}
                onChange={(e) =>
                  setForm({ ...form, receiveWallet: e.target.value })
                }
              />
            </div>

            <button className="btn btn-primary">
              Save Settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
