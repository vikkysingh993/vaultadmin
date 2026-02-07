import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../config/axios";

export default function PageList() {
  const [pages, setPages] = useState([]);

  useEffect(() => {
    api.get("/admin/pages",
        { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
    ).then(res => setPages(res.data));
  }, []);

  const deletePage = async (id) => {
    if (!window.confirm("Delete page?",
        { headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` } }
    )) return;
    await api.delete(`/admin/pages/${id}`);
    setPages(pages.filter(p => p.id !== id));
  };

  return (
    <>
      <h2>Static Pages</h2>

      <Link to="/admin/pages/add" className="btn btn-primary mb-3">
        + Add Page
      </Link>

      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {pages.map(p => (
            <tr key={p.id}>
              <td>{p.title}</td>
              <td>{p.slug}</td>
              <td>
                <Link
                  to={`/admin/pages/edit/${p.id}`}
                  className="btn btn-sm btn-warning me-2"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deletePage(p.id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
